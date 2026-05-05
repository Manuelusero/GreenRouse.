import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Usuario from '@/models/Usuario'
import Logger from '@/lib/logger'

// GET /api/usuarios - Obtener todos los usuarios
// POST /api/usuarios - Crear nuevo usuario
export async function GET() {
  try {
    await connectDB()
    const usuarios = await Usuario.find({}).select('-__v').sort({ createdAt: -1 })
    
    return NextResponse.json({
      success: true,
      data: usuarios,
      count: usuarios.length
    })
  } catch (error: unknown) {
    Logger.error('GET /api/usuarios error', {
      error: error instanceof Error ? error.message : String(error)
    })
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    
    // Validar datos requeridos
    const { nombre, email, experiencia, espacio, ubicacion, objetivos, tiempo } = body
    
    if (!nombre || !email || !experiencia || !espacio || !ubicacion || !objetivos || !tiempo) {
      return NextResponse.json({
        success: false,
        error: 'Todos los campos son requeridos'
      }, { status: 400 })
    }

    // Verificar si el email ya existe
    const usuarioExistente = await Usuario.findOne({ email: email.toLowerCase() })
    if (usuarioExistente) {
      return NextResponse.json({
        success: false,
        error: 'Ya existe un usuario con este email'
      }, { status: 400 })
    }

    // Crear nuevo usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      email: email.toLowerCase(),
      experiencia,
      espacio,
      ubicacion,
      objetivos,
      tiempo,
      perfil: body.perfil || {}
    })

    return NextResponse.json({
      success: true,
      data: nuevoUsuario,
      message: 'Usuario creado exitosamente'
    }, { status: 201 })

  } catch (error: unknown) {
    Logger.error('POST /api/usuarios error', {
      error: error instanceof Error ? error.message : String(error)
    })

    if (error instanceof Error && error.name === 'ValidationError') {
      const mongoErr = error as Error & { errors: Record<string, { message: string }> }
      const msgs = Object.values(mongoErr.errors).map(e => e.message)
      return NextResponse.json({ success: false, error: msgs[0] }, { status: 400 })
    }

    const withCode = error as { code?: number }
    if (withCode.code === 11000) {
      return NextResponse.json({ success: false, error: 'Ya existe un usuario con este email' }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 })
  }
}