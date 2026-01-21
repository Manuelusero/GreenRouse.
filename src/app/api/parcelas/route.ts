import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import connectDB from '@/lib/mongodb'
import Parcela from '@/models/Parcela'
import Usuario from '@/models/Usuario'
import CacheService from '@/lib/cache'
import Logger from '@/lib/logger'
import { withLogging, withCacheLogging } from '@/lib/loggingMiddleware'

// GET /api/parcelas - Obtener todas las parcelas del usuario con paginación y caché
const GET_handler = async (request: NextRequest) => {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'Usuario requerido' }, { status: 400 })
    }
    
    // Parámetros de paginación
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    
    // Parámetros de filtros
    const estado = searchParams.get('estado')
    const tipo = searchParams.get('tipo')
    const busqueda = searchParams.get('busqueda')
    
    // Validar que page y limit sean números válidos
    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json({ error: 'Parámetros de paginación inválidos' }, { status: 400 })
    }
    
    // Generar clave de caché única para esta consulta
    const cacheKey = `user_${userId}:page_${page}:limit_${limit}:estado_${estado || 'all'}:tipo_${tipo || 'all'}:search_${busqueda || 'none'}`
    
    // Intentar obtener del caché
    const cached = await CacheService.get('parcelas', cacheKey)
    if (cached) {
      Logger.cache('api_response', cacheKey, true, { userId, page, limit })
      
      const response = NextResponse.json(cached)
      response.headers.set('X-Cache', 'HIT')
      return response
    }
    
    Logger.cache('api_response', cacheKey, false, { userId, page, limit })
    
    // Buscar usuario por email
    const usuario = await Usuario.findOne({ email: userId })
    if (!usuario) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }
    
    // Construir filtro de búsqueda
    const filtro: any = { usuarioEmail: userId }
    
    if (estado && estado !== 'todos') {
      filtro.estado = estado
    }
    
    if (tipo && tipo !== 'todos') {
      filtro.tipo = tipo
    }
    
    if (busqueda) {
      filtro.$or = [
        { nombre: { $regex: busqueda, $options: 'i' } },
        { descripcion: { $regex: busqueda, $options: 'i' } },
        { cultivos: { $in: [new RegExp(busqueda, 'i')] } }
      ]
    }
    
    // Ejecutar ambas consultas en paralelo para mejor performance
    const [parcelas, total] = await Promise.all([
      Parcela.find(filtro)
        .select('-__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(), // lean() para mejor performance
      Parcela.countDocuments(filtro)
    ])
    
    // Calcular información de paginación
    const totalPages = Math.ceil(total / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1
    
    const response = {
      parcelas,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
        hasNextPage: hasNext,
        hasPrevPage: hasPrev
      },
      cached: false,
      timestamp: new Date().toISOString()
    }
    
    // Guardar en caché por 5 minutos
    await CacheService.set('parcelas', cacheKey, response)
    Logger.cache('cache_set', cacheKey, false, { userId, ttl: 300 })
    
    const finalResponse = NextResponse.json(response)
    finalResponse.headers.set('X-Cache', 'MISS')
    return finalResponse
  } catch (error: any) {
    Logger.error('Error obteniendo parcelas', {
      error: error.message,
      stack: error.stack,
      url: request.url
    })
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// Aplicar middleware de logging
export const GET = withCacheLogging(GET_handler)

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    
    console.log('📝 Datos recibidos en API parcelas:', JSON.stringify(body, null, 2))
    
    // Estructura nueva para creación automática
    const { 
      nombre, 
      descripcion, 
      tipo, 
      tamaño, 
      ubicacion, 
      clima, 
      objetivos, 
      plantas_deseadas, 
      usuario_id,
      configuracion_inicial,
      // Estructura legacy
      usuarioEmail, 
      area, 
      cultivos, 
      fechaSiembra, 
      estado, 
      riego 
    } = body
    
    // Determinar si es creación automática o manual
    const esCreacionAutomatica = !!configuracion_inicial?.generado_automaticamente
    
    let parcelaData: any = {}
    
    if (esCreacionAutomatica) {
      // Creación automática desde el perfil
      if (!usuario_id || !nombre || !plantas_deseadas) {
        return NextResponse.json({ error: 'Datos de parcela automática incompletos' }, { status: 400 })
      }
      
      // Buscar usuario por ID
      const usuarioObjectId = new mongoose.Types.ObjectId(usuario_id)
      const usuario = await Usuario.findById(usuarioObjectId)
      if (!usuario) {
        console.error('❌ Usuario no encontrado con ID:', usuario_id)
        return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
      }
      
      console.log('👤 Usuario encontrado:', usuario.email)

      parcelaData = {
        usuarioEmail: usuario.email,
        usuario_id: usuarioObjectId, // Usar ObjectId convertido
        nombre,
        descripcion: descripcion || `Parcela generada automáticamente: ${nombre}`,
        area: tamaño === 'pequeño' ? 5 : tamaño === 'mediano' ? 15 : tamaño === 'grande' ? 30 : 50,
        cultivos: plantas_deseadas || [],
        tipo: tipo || 'mixta',
        ubicacion: ubicacion || 'Sin especificar',
        clima: clima || 'automatico',
        objetivosString: Array.isArray(objetivos) ? objetivos.join(', ') : objetivos || '',
        fechaSiembra: new Date(),
        estado: 'Planificando',
        riego: configuracion_inicial.tiempo_mantenimiento === 'bajo' ? 'Cada 2 días' : 
               configuracion_inicial.tiempo_mantenimiento === 'medio' ? 'Diario' : 'Intensivo',
        configuracionInicial: configuracion_inicial,
        generadoAutomaticamente: true
      }
    } else {
      // Creación manual (estructura legacy)
      if (!usuarioEmail || !nombre || !area) {
        return NextResponse.json({ error: 'Todos los campos requeridos' }, { status: 400 })
      }

      // Verificar que el usuario existe
      console.log('🔍 Buscando usuario con email:', usuarioEmail)
      const usuario = await Usuario.findOne({ email: usuarioEmail })
      console.log('👤 Usuario encontrado:', usuario ? 'SÍ' : 'NO')
      
      if (!usuario) {
        // Intentar crear el usuario si no existe
        console.log('⚠️ Usuario no existe, creando nuevo usuario...')
        try {
          const nuevoUsuario = await Usuario.create({
            email: usuarioEmail,
            nombre: usuarioEmail.split('@')[0],
            provider: 'google'
          })
          console.log('✅ Usuario creado:', nuevoUsuario.email)
        } catch (createError) {
          console.error('❌ Error creando usuario:', createError)
          return NextResponse.json({ error: 'Error creando usuario' }, { status: 500 })
        }
      }

      parcelaData = {
        usuarioEmail,
        nombre,
        area: parseInt(area),
        cultivos: cultivos || [],
        fechaSiembra: fechaSiembra || new Date(),
        estado: estado || 'Preparando',
        riego: riego || 'Diario',
        generadoAutomaticamente: false
      }
    }

    console.log('💾 Datos de parcela a crear:', JSON.stringify(parcelaData, null, 2))

    // Crear nueva parcela
    const nuevaParcela = await Parcela.create(parcelaData)

    console.log('✅ Parcela creada exitosamente:', nuevaParcela._id)
    
    // Invalidar caché del usuario después de crear una parcela
    await CacheService.invalidateUser(usuarioEmail || parcelaData.usuarioEmail)
    console.log('🗑️ Cache invalidado para usuario:', usuarioEmail || parcelaData.usuarioEmail)
    
    return NextResponse.json(nuevaParcela, { status: 201 })

  } catch (error: any) {
    console.error('Error creando parcela:', error)
    
    // Errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ error: errorMessages[0] }, { status: 400 })
    }

    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}