'use client'

import { useState, useEffect } from 'react'
import { useAsociaciones, verificarCompatibilidad, esPlantaRecomendada } from '@/hooks/useAsociaciones'

interface Planta {
  nombre: string
  emoji: string
  espaciado: number
  color: string
  tamañoGrid: number // Cuántas celdas ocupa (1=1x1, 4=2x2, 9=3x3)
}

interface ParcelaVisualProps {
  nombre: string
  cultivos: string[]
  area: number
  dimensiones?: { largo: number; ancho: number } // en cm
  onEdit?: (nuevosCultivos: string[]) => void
}

const PLANTAS_INFO: Record<string, Planta> = {
  // Plantas pequeñas (1 celda = 1x1)
  'lechuga': { nombre: 'Lechuga', emoji: '🥬', espaciado: 25, color: 'bg-green-100', tamañoGrid: 1 },
  'espinaca': { nombre: 'Espinaca', emoji: '🌿', espaciado: 15, color: 'bg-green-200', tamañoGrid: 1 },
  'zanahoria': { nombre: 'Zanahoria', emoji: '🥕', espaciado: 15, color: 'bg-orange-100', tamañoGrid: 1 },
  'rábano': { nombre: 'Rábano', emoji: '🫘', espaciado: 10, color: 'bg-pink-100', tamañoGrid: 1 },
  'cilantro': { nombre: 'Cilantro', emoji: '🌾', espaciado: 10, color: 'bg-teal-100', tamañoGrid: 1 },
  'cebollín': { nombre: 'Cebollín', emoji: '🌱', espaciado: 10, color: 'bg-green-300', tamañoGrid: 1 },
  'perejil': { nombre: 'Perejil', emoji: '🌿', espaciado: 15, color: 'bg-lime-100', tamañoGrid: 1 },
  'albahaca': { nombre: 'Albahaca', emoji: '�', espaciado: 20, color: 'bg-emerald-100', tamañoGrid: 1 },
  'tomillo': { nombre: 'Tomillo', emoji: '🌿', espaciado: 20, color: 'bg-lime-200', tamañoGrid: 1 },
  'orégano': { nombre: 'Orégano', emoji: '🌿', espaciado: 25, color: 'bg-green-100', tamañoGrid: 1 },
  
  // Plantas medianas (4 celdas = 2x2)
  'menta': { nombre: 'Menta', emoji: '�', espaciado: 30, color: 'bg-green-100', tamañoGrid: 4 },
  'salvia': { nombre: 'Salvia', emoji: '🌿', espaciado: 30, color: 'bg-gray-100', tamañoGrid: 4 },
  'brócoli': { nombre: 'Brócoli', emoji: '🥦', espaciado: 35, color: 'bg-green-400', tamañoGrid: 4 },
  'lavanda': { nombre: 'Lavanda', emoji: '💜', espaciado: 35, color: 'bg-purple-200', tamañoGrid: 4 },
  'pimiento': { nombre: 'Pimiento', emoji: '�️', espaciado: 40, color: 'bg-yellow-100', tamañoGrid: 4 },
  'romero': { nombre: 'Romero', emoji: '�', espaciado: 40, color: 'bg-emerald-200', tamañoGrid: 4 },
  'pepino': { nombre: 'Pepino', emoji: '🥒', espaciado: 45, color: 'bg-green-200', tamañoGrid: 4 },
  
  // Plantas grandes (9 celdas = 3x3)
  'tomate': { nombre: 'Tomate', emoji: '🍅', espaciado: 50, color: 'bg-red-100', tamañoGrid: 4 },
  'berenjena': { nombre: 'Berenjena', emoji: '�', espaciado: 60, color: 'bg-purple-100', tamañoGrid: 4 },
  'calabacín': { nombre: 'Calabacín', emoji: '🥒', espaciado: 60, color: 'bg-green-300', tamañoGrid: 4 },
}

interface CeldaGrid {
  fila: number
  columna: number
  planta: string | null
  id: string
  esPrincipal: boolean // Si es la celda principal de una planta multi-celda
  plantaPrincipalId?: string // ID de la celda principal si esta es secundaria
  esPasillo: boolean // Si es un pasillo (no cultivable)
}

export default function ParcelaVisualGrid({ nombre, cultivos, area, dimensiones, onEdit }: ParcelaVisualProps) {
  const [editMode, setEditMode] = useState(false)
  const [selectedPlantToAdd, setSelectedPlantToAdd] = useState<string | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [draggedCellId, setDraggedCellId] = useState<string | null>(null)
  const [mostrarTodasPlantas, setMostrarTodasPlantas] = useState(false)
  
  // Calcular dimensiones reales en metros
  let largoMetros: number
  let anchoMetros: number
  
  if (dimensiones?.largo && dimensiones?.ancho) {
    // Usar dimensiones proporcionadas (convertir de cm a m)
    largoMetros = dimensiones.largo / 100
    anchoMetros = dimensiones.ancho / 100
  } else {
    // Calcular dimensiones a partir del área (asumiendo rectángulo ~3:4)
    anchoMetros = Math.sqrt(area * 1.33) // más ancho
    largoMetros = area / anchoMetros // más largo
  }
  
  // ESCALA REAL: Cada celda representa 25cm x 25cm (0.25m x 0.25m)
  const TAMANO_CELDA_METROS = 0.25
  
  // Calcular número de filas y columnas basado en dimensiones reales
  // Usar Math.floor para que no sobre espacio
  const filas = Math.floor(largoMetros / TAMANO_CELDA_METROS)
  const columnas = Math.floor(anchoMetros / TAMANO_CELDA_METROS)
  
  // Tamaño visual de cada celda en píxeles
  const TAMANO_CELDA_PX = 35
  
  // Estado del grid
  const [grid, setGrid] = useState<CeldaGrid[]>([])
  
  // Inicializar grid con pasillos cada 1 metro (4 filas de cultivo + 1 fila de pasillo)
  useEffect(() => {
    const nuevoGrid: CeldaGrid[] = []
    for (let f = 0; f < filas; f++) {
      // Determinar si esta fila es un pasillo
      // Patrón: 4 filas cultivo, 1 fila pasillo (cada 1m = 4 celdas de 25cm)
      const esPasilloFila = f > 0 && (f + 1) % 5 === 0
      
      for (let c = 0; c < columnas; c++) {
        nuevoGrid.push({
          fila: f,
          columna: c,
          planta: null,
          id: `cell-${f}-${c}`,
          esPrincipal: false,
          esPasillo: esPasilloFila
        })
      }
    }
    
    console.log('Grid inicializado con pasillos horizontales:', {
      totalFilas: filas,
      totalColumnas: columnas,
      pasillosEnFilas: Array.from({length: filas}, (_, i) => i).filter(f => f > 0 && (f + 1) % 5 === 0)
    })
    
    setGrid(nuevoGrid)
  }, [filas, columnas])
  
  // Distribuir plantas iniciales en el grid
  useEffect(() => {
    if (grid.length > 0 && cultivos.length > 0) {
      // Verificar si el grid ya tiene plantas (para no reinicializar en cada render)
      const tienePlantas = grid.some(c => c.planta !== null)
      if (tienePlantas) return
      
      // IMPORTANTE: Hacer copia profunda del grid para no modificar el original
      const nuevoGrid = grid.map(celda => ({ ...celda }))
      
      // Función auxiliar para verificar si un área está disponible
      const areaDisponible = (fila: number, columna: number, tamañoCeldas: number): boolean => {
        const lado = Math.sqrt(tamañoCeldas) // 1->1x1, 4->2x2, 9->3x3
        for (let f = fila; f < fila + lado && f < filas; f++) {
          for (let c = columna; c < columna + lado && c < columnas; c++) {
            const celda = nuevoGrid.find(cell => cell.fila === f && cell.columna === c)
            // No disponible si no existe, ya tiene planta, o ES UN PASILLO
            if (!celda || celda.planta !== null || celda.esPasillo) return false
          }
        }
        return true
      }
      
      // Función auxiliar para ocupar un área con una planta
      const ocuparArea = (fila: number, columna: number, nombrePlanta: string, tamañoCeldas: number) => {
        const lado = Math.sqrt(tamañoCeldas)
        const celdaPrincipalId = `cell-${fila}-${columna}`
        
        for (let f = fila; f < fila + lado && f < filas; f++) {
          for (let c = columna; c < columna + lado && c < columnas; c++) {
            const index = nuevoGrid.findIndex(cell => cell.fila === f && cell.columna === c)
            if (index !== -1 && !nuevoGrid[index].esPasillo) {
              // Solo ocupar si NO es un pasillo
              nuevoGrid[index].planta = nombrePlanta
              nuevoGrid[index].esPrincipal = (f === fila && c === columna)
              if (!nuevoGrid[index].esPrincipal) {
                nuevoGrid[index].plantaPrincipalId = celdaPrincipalId
              }
            }
          }
        }
      }
      
      // Calcular cuántas plantas de cada tipo caben según su espaciado
      const areaDisponibleCm2 = area * 10000 // convertir m² a cm²
      const plantasConCantidades: Array<{ nombre: string; cantidad: number; tamañoGrid: number }> = []
      
      cultivos.forEach(cultivoNombre => {
        const cultivoKey = cultivoNombre.toLowerCase()
        const plantaInfo = PLANTAS_INFO[cultivoKey]
        if (plantaInfo) {
          // Calcular área que ocupa cada planta (espaciado²)
          const areaPlantaCm2 = plantaInfo.espaciado * plantaInfo.espaciado
          // Calcular cuántas caben (aumentado al 90% para llenar más espacio)
          const cantidadCalculada = Math.floor((areaDisponibleCm2 / cultivos.length / areaPlantaCm2) * 0.9)
          const cantidadFinal = Math.max(2, Math.min(cantidadCalculada, Math.floor(grid.length / plantaInfo.tamañoGrid)))
          
          plantasConCantidades.push({
            nombre: cultivoKey,
            cantidad: cantidadFinal,
            tamañoGrid: plantaInfo.tamañoGrid
          })
        }
      })
      
      // Distribuir las plantas en el grid
      plantasConCantidades.forEach(({ nombre, cantidad, tamañoGrid }) => {
        let plantasColocadas = 0
        const lado = Math.sqrt(tamañoGrid)
        
        for (let f = 0; f < filas && plantasColocadas < cantidad; f++) {
          for (let c = 0; c < columnas && plantasColocadas < cantidad; c++) {
            if (areaDisponible(f, c, tamañoGrid)) {
              ocuparArea(f, c, nombre, tamañoGrid)
              plantasColocadas++
              // Saltar columnas ocupadas
              c += lado - 1
            }
          }
        }
      })
      
      setGrid(nuevoGrid)
    }
  }, [cultivos, grid.length, area, filas, columnas])
  
  // Mostrar feedback temporal
  const mostrarFeedback = (mensaje: string) => {
    setFeedbackMessage(mensaje)
    setTimeout(() => setFeedbackMessage(null), 2000)
  }
  
  // Manejar click en celda
  const handleCellClick = (cellId: string) => {
    if (!editMode) return
    
    const celda = grid.find(c => c.id === cellId)
    if (!celda) return
    
    // Verificar si es un pasillo
    if (celda.esPasillo) {
      mostrarFeedback('🚫 No puedes plantar en los pasillos')
      return
    }
    
    // Si hay una planta seleccionada para agregar y la celda está vacía
    if (selectedPlantToAdd && celda.planta === null && !celda.plantaPrincipalId) {
      const plantaInfo = PLANTAS_INFO[selectedPlantToAdd]
      if (!plantaInfo) return
      
      const tamañoGrid = plantaInfo.tamañoGrid
      const lado = Math.sqrt(tamañoGrid)
      
      // Verificar que hay espacio disponible (incluye check de pasillos)
      let espacioDisponible = true
      for (let f = celda.fila; f < celda.fila + lado && f < filas; f++) {
        for (let c = celda.columna; c < celda.columna + lado && c < columnas; c++) {
          const celdaCheck = grid.find(cell => cell.fila === f && cell.columna === c)
          // Verificar que la celda existe, no tiene planta, no está marcada como secundaria Y NO ES PASILLO
          if (!celdaCheck || celdaCheck.planta !== null || celdaCheck.plantaPrincipalId || celdaCheck.esPasillo) {
            espacioDisponible = false
            break
          }
        }
        if (!espacioDisponible) break
      }
      
      if (!espacioDisponible) {
        mostrarFeedback(`❌ No hay espacio suficiente para ${plantaInfo.nombre} (necesita ${lado}×${lado} y evitar pasillos)`)
        return
      }
      
      // Ocupar el área
      const nuevoGrid = [...grid]
      for (let f = celda.fila; f < celda.fila + lado && f < filas; f++) {
        for (let c = celda.columna; c < celda.columna + lado && c < columnas; c++) {
          const index = nuevoGrid.findIndex(cell => cell.fila === f && cell.columna === c)
          if (index !== -1) {
            nuevoGrid[index].planta = selectedPlantToAdd
            nuevoGrid[index].esPrincipal = (f === celda.fila && c === celda.columna)
            if (!nuevoGrid[index].esPrincipal) {
              nuevoGrid[index].plantaPrincipalId = cellId
            }
          }
        }
      }
      
      setGrid(nuevoGrid)
      mostrarFeedback(`✅ ${plantaInfo.nombre} añadida (${lado}×${lado})`)
      setSelectedPlantToAdd(null)
    }
  }
  
  // Eliminar planta específica
  const eliminarPlanta = (cellId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const celda = grid.find(c => c.id === cellId)
    if (!celda || !celda.planta) return
    
    const nombrePlanta = PLANTAS_INFO[celda.planta.toLowerCase()]?.nombre || celda.planta
    const plantaInfo = PLANTAS_INFO[celda.planta.toLowerCase()]
    
    // Si es una celda principal, eliminar todas las celdas asociadas
    if (celda.esPrincipal && plantaInfo) {
      const lado = Math.sqrt(plantaInfo.tamañoGrid)
      const nuevoGrid = [...grid]
      
      for (let f = celda.fila; f < celda.fila + lado && f < filas; f++) {
        for (let c = celda.columna; c < celda.columna + lado && c < columnas; c++) {
          const index = nuevoGrid.findIndex(cell => cell.fila === f && cell.columna === c)
          if (index !== -1) {
            nuevoGrid[index].planta = null
            nuevoGrid[index].esPrincipal = false
            nuevoGrid[index].plantaPrincipalId = undefined
          }
        }
      }
      
      setGrid(nuevoGrid)
    } else {
      // Si es una celda secundaria, encontrar la principal y eliminar todo el grupo
      const celdaPrincipalId = celda.plantaPrincipalId || cellId
      const celdaPrincipal = grid.find(c => c.id === celdaPrincipalId)
      if (celdaPrincipal) {
        eliminarPlanta(celdaPrincipalId, e)
        return
      }
    }
    
    mostrarFeedback(`❌ ${nombrePlanta} eliminada`)
  }
  
  // Iniciar drag
  const handleDragStart = (cellId: string, e: React.DragEvent) => {
    const celda = grid.find(c => c.id === cellId)
    if (!celda || !celda.planta) {
      e.preventDefault()
      return
    }
    setDraggedCellId(cellId)
    e.dataTransfer.effectAllowed = 'move'
  }
  
  // Permitir drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }
  
  // Manejar drop
  const handleDrop = (targetCellId: string, e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedCellId || draggedCellId === targetCellId) {
      setDraggedCellId(null)
      return
    }
    
    const celdaOrigen = grid.find(c => c.id === draggedCellId)
    const celdaDestino = grid.find(c => c.id === targetCellId)
    
    if (!celdaOrigen || !celdaDestino || !celdaOrigen.planta) {
      setDraggedCellId(null)
      return
    }
    
    const plantaInfo = PLANTAS_INFO[celdaOrigen.planta.toLowerCase()]
    if (!plantaInfo) {
      setDraggedCellId(null)
      return
    }
    
    const tamañoGrid = plantaInfo.tamañoGrid
    const lado = Math.sqrt(tamañoGrid)
    
    // Verificar que hay espacio en el destino
    let espacioDisponible = true
    for (let f = celdaDestino.fila; f < celdaDestino.fila + lado && f < filas; f++) {
      for (let c = celdaDestino.columna; c < celdaDestino.columna + lado && c < columnas; c++) {
        const celdaCheck = grid.find(cell => cell.fila === f && cell.columna === c)
        // Está disponible si está vacía O si es parte de la misma planta que estamos moviendo
        if (!celdaCheck || (celdaCheck.planta !== null && celdaCheck.planta !== celdaOrigen.planta)) {
          espacioDisponible = false
          break
        }
      }
      if (!espacioDisponible) break
    }
    
    if (!espacioDisponible) {
      mostrarFeedback(`❌ No hay espacio suficiente`)
      setDraggedCellId(null)
      return
    }
    
    const nuevoGrid = [...grid]
    
    // 1. Limpiar la posición original
    for (let f = celdaOrigen.fila; f < celdaOrigen.fila + lado && f < filas; f++) {
      for (let c = celdaOrigen.columna; c < celdaOrigen.columna + lado && c < columnas; c++) {
        const index = nuevoGrid.findIndex(cell => cell.fila === f && cell.columna === c)
        if (index !== -1 && nuevoGrid[index].planta === celdaOrigen.planta) {
          nuevoGrid[index].planta = null
          nuevoGrid[index].esPrincipal = false
          nuevoGrid[index].plantaPrincipalId = undefined
        }
      }
    }
    
    // 2. Colocar en la nueva posición
    for (let f = celdaDestino.fila; f < celdaDestino.fila + lado && f < filas; f++) {
      for (let c = celdaDestino.columna; c < celdaDestino.columna + lado && c < columnas; c++) {
        const index = nuevoGrid.findIndex(cell => cell.fila === f && cell.columna === c)
        if (index !== -1) {
          nuevoGrid[index].planta = celdaOrigen.planta
          nuevoGrid[index].esPrincipal = (f === celdaDestino.fila && c === celdaDestino.columna)
          if (!nuevoGrid[index].esPrincipal) {
            nuevoGrid[index].plantaPrincipalId = targetCellId
          }
        }
      }
    }
    
    setGrid(nuevoGrid)
    const nombrePlanta = plantaInfo.nombre
    mostrarFeedback(`🔄 ${nombrePlanta} movida`)
    setDraggedCellId(null)
  }
  
  // Guardar cambios
  const handleSave = () => {
    const plantasActuales = grid
      .filter(c => c.planta !== null && c.esPrincipal)
      .map(c => c.planta!)
    
    if (onEdit) {
      onEdit(plantasActuales)
    }
    setEditMode(false)
    mostrarFeedback('💾 Cambios guardados')
  }
  
  // Cancelar edición
  const handleCancel = () => {
    setEditMode(false)
    setSelectedPlantToAdd(null)
    // Recargar grid con cultivos originales
    const nuevoGrid: CeldaGrid[] = grid.map(c => ({ ...c, planta: null }))
    let plantIndex = 0
    for (let i = 0; i < nuevoGrid.length && plantIndex < cultivos.length; i++) {
      nuevoGrid[i] = { ...nuevoGrid[i], planta: cultivos[plantIndex] }
      plantIndex++
    }
    setGrid(nuevoGrid)
    mostrarFeedback('❌ Edición cancelada')
  }
  
  // Plantas disponibles
  const plantasDisponibles = Object.keys(PLANTAS_INFO)
  
  // Contar plantas (solo las principales)
  const conteoActual: Record<string, number> = {}
  grid.forEach(celda => {
    if (celda.planta && celda.esPrincipal) {
      conteoActual[celda.planta] = (conteoActual[celda.planta] || 0) + 1
    }
  })
  
  const totalPlantas = Object.values(conteoActual).reduce((a, b) => a + b, 0)

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Feedback Message */}
      {feedbackMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-3 md:px-6 py-2 md:py-3 rounded-lg shadow-xl animate-bounce text-sm md:text-base">
          {feedbackMessage}
        </div>
      )}
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">{nombre}</h2>
          <p className="text-sm md:text-base text-gray-600">
            📐 {area}m² • 🌱 {totalPlantas} plantas
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition-colors text-sm md:text-base flex-1 md:flex-none"
            >
              ✏️ Editar
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition-colors text-sm md:text-base flex-1"
              >
                ✖️ Cancelar
              </button>
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition-colors text-sm md:text-base flex-1"
              >
                ✅ Guardar
              </button>
            </>
          )}
        </div>
      </div>

      {/* Grid de Parcela */}
      <div className="mb-6 p-2 md:p-4 bg-gradient-to-br from-green-50 via-amber-50 to-green-100 rounded-xl border-4 border-amber-700 overflow-auto max-h-[500px] md:max-h-[600px]">
        <div 
          className="grid relative"
          style={{
            gridTemplateColumns: `repeat(${columnas}, ${TAMANO_CELDA_PX}px)`,
            gridTemplateRows: `repeat(${filas}, ${TAMANO_CELDA_PX}px)`,
            gap: '2px'
          }}
        >
          {grid.map((celda) => {
            // PRIMERO: Renderizar pasillos (tienen prioridad absoluta)
            if (celda.esPasillo) {
              return (
                <div
                  key={celda.id}
                  className="relative border-2 border-gray-400 bg-gradient-to-b from-gray-300 to-gray-400 rounded-sm"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)'
                  }}
                  title="Pasillo de acceso (no cultivable)"
                >
                  <div className="flex items-center justify-center h-full text-[8px] text-gray-600 opacity-50">
                    👣
                  </div>
                </div>
              )
            }
            
            const info = celda.planta ? PLANTAS_INFO[celda.planta.toLowerCase()] : null
            const isDragging = draggedCellId === celda.id
            const isSelected = selectedPlantToAdd !== null && celda.planta === null && celda.plantaPrincipalId === undefined && !celda.esPasillo
            const tamañoGrid = info?.tamañoGrid || 1
            const lado = Math.sqrt(tamañoGrid)
            
            // SEGUNDO: Si es celda secundaria, renderizar con mismo color pero sin borde visible
            if (celda.planta && !celda.esPrincipal) {
              return (
                <div 
                  key={celda.id} 
                  className={`${info?.color || 'bg-white'} rounded-sm`}
                  style={{ border: 'none' }}
                  title={`Parte de ${info?.nombre || celda.planta}`}
                />
              )
            }
            
            // TERCERO: Renderizar celdas principales (con planta o vacías)
            return (
              <div
                key={celda.id}
                onClick={() => handleCellClick(celda.id)}
                onDragOver={editMode ? handleDragOver : undefined}
                onDrop={editMode ? (e) => handleDrop(celda.id, e) : undefined}
                className={`
                  relative border-2 rounded-lg transition-all cursor-pointer
                  ${celda.planta && info ? info.color : 'bg-white border-dashed'}
                  ${editMode && celda.planta ? 'hover:shadow-lg hover:scale-105' : ''}
                  ${isSelected ? 'border-green-500 bg-green-50 animate-pulse' : 'border-gray-300'}
                  ${isDragging ? 'opacity-50 scale-95' : ''}
                `}
                style={
                  // Para plantas multi-celda, usar grid positioning para ocupar múltiples celdas
                  celda.esPrincipal && tamañoGrid > 1
                    ? {
                        gridColumn: `span ${lado}`,
                        gridRow: `span ${lado}`,
                        zIndex: 5
                      }
                    : undefined
                }
                draggable={editMode && celda.planta !== null && celda.esPrincipal}
                onDragStart={editMode ? (e) => handleDragStart(celda.id, e) : undefined}
                title={celda.planta && info ? `${info.nombre} (${lado}×${lado})` : editMode && selectedPlantToAdd ? 'Click para colocar' : 'Vacío'}
              >
                {celda.planta && info ? (
                  <>
                    <div className="flex flex-col items-center justify-center h-full w-full overflow-hidden">
                      <span 
                        className="select-none leading-none"
                        style={{ 
                          fontSize: lado === 1 ? '0.75rem' : lado === 2 ? '1.25rem' : '2rem'
                        }}
                      >
                        {info.emoji}
                      </span>
                      {lado >= 3 && (
                        <span className="text-[6px] font-semibold text-gray-700 mt-0.5 hidden md:block">
                          {info.nombre}
                        </span>
                      )}
                    </div>
                    {editMode && celda.esPrincipal && (
                      <button
                        onClick={(e) => eliminarPlanta(celda.id, e)}
                        className="absolute -top-0.5 -right-0.5 bg-red-500 hover:bg-red-600 text-white rounded-full w-3.5 h-3.5 md:w-4 md:h-4 flex items-center justify-center text-[8px] md:text-[10px] font-bold shadow-lg z-10 transition-transform hover:scale-110"
                      >
                        ×
                      </button>
                    )}
                  </>
                ) : celda.planta && !info ? (
                  <div className="flex flex-col items-center justify-center h-full bg-red-100 rounded p-0.5">
                    <span className="text-[6px] text-red-600">
                      ⚠️
                    </span>
                    {editMode && (
                      <button
                        onClick={(e) => eliminarPlanta(celda.id, e)}
                        className="bg-red-500 text-white rounded text-[6px] px-0.5"
                      >
                        X
                      </button>
                    )}
                  </div>
                ) : editMode && selectedPlantToAdd ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <span className="text-xs">+</span>
                    <span className="text-2xl">+</span>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>

      {/* Panel de selección de plantas */}
      {editMode && (
        <div className="mt-4 md:mt-6 p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-2 md:mb-3 text-sm md:text-base">
            {selectedPlantToAdd 
              ? `✨ ${PLANTAS_INFO[selectedPlantToAdd]?.nombre} - Click para colocar`
              : '🌱 Selecciona una planta:'
            }
          </h3>
          <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-1.5 md:gap-2">
            {plantasDisponibles.map(planta => {
              const info = PLANTAS_INFO[planta]
              const isSelected = selectedPlantToAdd === planta
              const lado = Math.sqrt(info.tamañoGrid)
              return (
                <button
                  key={planta}
                  onClick={() => setSelectedPlantToAdd(isSelected ? null : planta)}
                  className={`p-2 md:p-3 rounded-lg border-2 transition-all transform hover:scale-105 active:scale-95 ${
                    isSelected 
                      ? 'border-green-500 bg-green-100 ring-2 ring-green-300 scale-105' 
                      : `${info.color} border-gray-300 hover:border-green-500`
                  }`}
                  title={`${info.nombre} - Tamaño: ${lado}×${lado}`}
                >
                  <div className="text-center">
                    <div className="text-xl md:text-2xl mb-0.5 md:mb-1">{info.emoji}</div>
                    <div className="text-[8px] md:text-xs font-medium text-gray-700 leading-tight">{info.nombre}</div>
                    <div className="text-[8px] md:text-xs text-gray-500 mt-0.5">{lado}×{lado}</div>
                  </div>
                </button>
              )
            })}
          </div>
          
          <div className="mt-3 md:mt-4 text-xs md:text-sm text-gray-700 bg-blue-50 p-2 md:p-3 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <span className="text-base md:text-lg">💡</span>
              <div>
                <p className="font-semibold mb-1">Cómo usar el editor:</p>
                <ul className="list-disc list-inside space-y-0.5 md:space-y-1 text-[10px] md:text-xs">
                  <li><strong>Añadir:</strong> Click en planta → Click en celda vacía</li>
                  <li><strong>Eliminar:</strong> Click en la × roja</li>
                  <li><strong>Mover:</strong> Arrastra la planta</li>
                  <li><strong>Tamaños:</strong> 1×1 (pequeñas), 2×2 (medianas), 3×3 (grandes)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resumen de plantas */}
      <div className="mt-6">
        <h3 className="font-semibold text-gray-800 mb-3">🌿 Plantas en tu jardín:</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(conteoActual).map(([planta, cantidad]) => {
            const info = PLANTAS_INFO[planta]
            if (!info) return null
            return (
              <div key={planta} className={`${info.color} p-3 rounded-lg border border-gray-300`}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{info.emoji}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{info.nombre}</div>
                    <div className="text-xs text-gray-600">{cantidad} planta{cantidad > 1 ? 's' : ''}</div>
                  </div>
                </div>
              </div>
            )
          })}
          {totalPlantas === 0 && (
            <div className="col-span-full text-center text-gray-500 py-8">
              No hay plantas en el jardín. {editMode ? 'Agrega algunas usando los botones de abajo.' : 'Haz click en Editar para agregar.'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
