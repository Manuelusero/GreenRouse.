import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import connectDB from '@/lib/mongodb'
import Usuario from '@/models/Usuario'
import CacheService from '@/lib/cache'
import Logger from '@/lib/logger'

// GET /api/usuarios/[id] - Obtener usuario con caché
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    
    const { id: userId } = await params
    
    // Intentar obtener del caché primero
    const cached = await CacheService.get('usuario', userId)
    if (cached) {
      return NextResponse.json({
        ...cached,
        cached: true,
        timestamp: new Date().toISOString()
      })
    }
    
    const usuario = await Usuario.findById(userId).select('-password -__v')
    
    if (!usuario) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }
    
    const response = {
      ...usuario.toObject(),
      cached: false,
      timestamp: new Date().toISOString()
    }
    
    // Guardar en caché por 1 hora
    await CacheService.set('usuario', userId, response)
    
    return NextResponse.json(response)
  } catch (error: unknown) {
    Logger.error('GET /api/usuarios/[id] error', {
      error: error instanceof Error ? error.message : String(error)
    })
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// PUT /api/usuarios/[id] - Actualizar usuario e invalidar caché
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    
    const { id: userId } = await params
    const body = await request.json()
    
    const usuario = await Usuario.findByIdAndUpdate(
      userId,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-password -__v')
    
    if (!usuario) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }
    
    // Invalidar caché del usuario
    await CacheService.del('usuario', userId)
    
    // También invalidar caché de parcelas del usuario
    await CacheService.invalidateUser(usuario.email)
    
    return NextResponse.json(usuario)
  } catch (error: unknown) {
    Logger.error('PUT /api/usuarios/[id] error', {
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
