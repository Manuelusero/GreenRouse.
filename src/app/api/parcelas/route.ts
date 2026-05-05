import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import connectDB from '@/lib/mongodb'
import Parcela from '@/models/Parcela'
import Usuario from '@/models/Usuario'
import CacheService from '@/lib/cache'
import Logger from '@/lib/logger'
import { withLogging, withCacheLogging } from '@/lib/loggingMiddleware'

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

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
    const filtro: Record<string, unknown> = { usuarioEmail: userId }
    
    if (estado && estado !== 'todos') {
      filtro.estado = estado
    }
    
    if (tipo && tipo !== 'todos') {
      filtro.tipo = tipo
    }
    
    if (busqueda) {
      const safe = escapeRegex(busqueda)
      filtro.$or = [
        { nombre: { $regex: safe, $options: 'i' } },
        { descripcion: { $regex: safe, $options: 'i' } },
        { cultivos: { $in: [new RegExp(safe, 'i')] } }
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
  } catch (error: unknown) {
    Logger.error('Error obteniendo parcelas', {
      error: error instanceof Error ? error.message : String(error),
      url: request.url
    })
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// Aplicar middleware de logging
export const GET = withCacheLogging(GET_handler)

const POST_handler = async (request: NextRequest) => {
  try {
    await connectDB()
    const body = await request.json()
    
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
    
    let parcelaData: Record<string, unknown> = {}
    
    if (esCreacionAutomatica) {
      // Creación automática desde el perfil
      if (!usuario_id || !nombre || !plantas_deseadas) {
        return NextResponse.json({ error: 'Datos de parcela automática incompletos' }, { status: 400 })
      }
      
      // Buscar usuario por ID
      const usuarioObjectId = new mongoose.Types.ObjectId(usuario_id)
      const usuario = await Usuario.findById(usuarioObjectId)
      if (!usuario) {
        Logger.warn('POST /api/parcelas: usuario no encontrado', { usuario_id })
        return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
      }

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
      const usuario = await Usuario.findOne({ email: usuarioEmail })
      
      if (!usuario) {
        // Intentar crear el usuario si no existe
        try {
          await Usuario.create({
            email: usuarioEmail,
            nombre: usuarioEmail.split('@')[0],
            provider: 'google'
          })
        } catch (createError: unknown) {
          Logger.error('POST /api/parcelas: error creando usuario fallback', {
            error: createError instanceof Error ? createError.message : String(createError)
          })
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

    // Crear nueva parcela
    const nuevaParcela = await Parcela.create(parcelaData)

    // Invalidar caché del usuario después de crear una parcela
    await CacheService.invalidateUser((usuarioEmail || parcelaData.usuarioEmail) as string)
    
    return NextResponse.json(nuevaParcela, { status: 201 })

  } catch (error: unknown) {
    Logger.error('POST /api/parcelas error', {
      error: error instanceof Error ? error.message : String(error)
    })
    
    if (error instanceof Error && error.name === 'ValidationError') {
      const mongoErr = error as Error & { errors: Record<string, { message: string }> }
      const msgs = Object.values(mongoErr.errors).map(e => e.message)
      return NextResponse.json({ error: msgs[0] }, { status: 400 })
    }

    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export const POST = withLogging(POST_handler)