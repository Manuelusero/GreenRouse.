import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import connectDB from '@/lib/mongodb'
import Parcela from '@/models/Parcela'
import Logger from '@/lib/logger'

// DELETE /api/parcelas/[id] - Eliminar una parcela específica
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    
    const { id } = await params
    
    // Validar que el ID es válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID de parcela inválido' }, { status: 400 })
    }
    
    // Buscar y eliminar la parcela
    const parcelaEliminada = await Parcela.findByIdAndDelete(id)
    
    if (!parcelaEliminada) {
      return NextResponse.json({ error: 'Parcela no encontrada' }, { status: 404 })
    }
    
    return NextResponse.json({ 
      message: 'Parcela eliminada exitosamente',
      parcela: parcelaEliminada 
    }, { status: 200 })
    
  } catch (error: unknown) {
    Logger.error('DELETE /api/parcelas/[id] error', {
      error: error instanceof Error ? error.message : String(error)
    })
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// GET /api/parcelas/[id] - Obtener una parcela específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    
    const { id } = await params
    
    // Validar que el ID es válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID de parcela inválido' }, { status: 400 })
    }
    
    // Buscar la parcela
    const parcela = await Parcela.findById(id).select('-__v')
    
    if (!parcela) {
      return NextResponse.json({ error: 'Parcela no encontrada' }, { status: 404 })
    }
    
    return NextResponse.json(parcela)
    
  } catch (error: unknown) {
    Logger.error('GET /api/parcelas/[id] error', {
      error: error instanceof Error ? error.message : String(error)
    })
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// PUT /api/parcelas/[id] - Actualizar una parcela específica
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    
    const { id } = await params
    const body = await request.json()
    
    // Validar que el ID es válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID de parcela inválido' }, { status: 400 })
    }
    
    // Actualizar la parcela
    const parcelaActualizada = await Parcela.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    )
    
    if (!parcelaActualizada) {
      return NextResponse.json({ error: 'Parcela no encontrada' }, { status: 404 })
    }
    
    return NextResponse.json(parcelaActualizada)
    
  } catch (error: unknown) {
    Logger.error('PUT /api/parcelas/[id] error', {
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
