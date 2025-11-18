import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import connectDB from '@/lib/mongodb'
import Parcela from '@/models/Parcela'

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
    
    console.log('🗑️ Parcela eliminada:', parcelaEliminada._id)
    
    return NextResponse.json({ 
      message: 'Parcela eliminada exitosamente',
      parcela: parcelaEliminada 
    }, { status: 200 })
    
  } catch (error: any) {
    console.error('Error eliminando parcela:', error)
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
    
  } catch (error: any) {
    console.error('Error obteniendo parcela:', error)
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
    
    console.log('✅ Parcela actualizada:', parcelaActualizada._id)
    
    return NextResponse.json(parcelaActualizada)
    
  } catch (error: any) {
    console.error('Error actualizando parcela:', error)
    
    // Errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ error: errorMessages[0] }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
