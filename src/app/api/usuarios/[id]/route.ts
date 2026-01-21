import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import connectDB from '@/lib/mongodb'
import Usuario from '@/models/Usuario'
import CacheService from '@/lib/cache'

// GET /api/usuarios/[id] - Obtener usuario con caché
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    
    const { id: userId } = await params
    
    // Intentar obtener del caché primero
    const cached = await CacheService.get('usuario', userId)
    if (cached) {
      console.log(`📦 Cache HIT para usuario: ${userId}`)
      return NextResponse.json({
        ...cached,
        cached: true,
        timestamp: new Date().toISOString()
      })
    }
    
    console.log(`🔍 Cache MISS para usuario: ${userId}`)
    
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
    console.log(`💾 Cache SET para usuario: ${userId}`)
    
    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Error obteniendo usuario:', error)
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
    console.log(`🗑️ Cache invalidado para usuario: ${userId}`)
    
    // También invalidar caché de parcelas del usuario
    await CacheService.invalidateUser(usuario.email)
    console.log(`🗑️ Cache de parcelas invalidado para email: ${usuario.email}`)
    
    return NextResponse.json(usuario)
  } catch (error: any) {
    console.error('Error actualizando usuario:', error)
    
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ error: errorMessages[0] }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
