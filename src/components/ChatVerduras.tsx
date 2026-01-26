'use client'

import { useState, useRef, useEffect } from 'react'
import { Verdura } from '@/data/verduras'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

interface ChatVerdurasProps {
  verdura?: Verdura // Hacer opcional para manejar casos donde no existe
}

export default function ChatVerduras({ verdura }: ChatVerdurasProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [randomSuggestionIndex, setRandomSuggestionIndex] = useState(0)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Generar sugerencias contextuales basadas en el input actual
  const getContextualSuggestions = (currentInput: string) => {
    const input = currentInput.toLowerCase()
    const allSuggestions = [
      '¿Cuándo es la mejor época para sembrar?',
      '¿Cómo sé cuándo está listo para cosechar?',
      '¿Qué plagas debo vigilar?',
      '¿Cuánta agua necesita?',
      '¿Puedo plantar en macetas?',
      '¿Qué abono orgánico recomiendas?',
      '¿Cómo preparo el suelo?',
      '¿Cuál es el espaciado ideal?',
      '¿Qué plantas son buenas compañeras?',
      '¿Cómo combatir pulgones orgánicamente?',
      '¿Necesita mucho sol?',
      '¿Cuánto tiempo tarda en crecer?',
      '¿Es resistente al frío?',
      '¿Cómo sé si está maduro?',
      '¿Qué nutrientes necesita?',
      '¿Puedo conservar las semillas?',
      '¿Cómo lo puedo reproducir?'
    ]

    // Filtrar sugerencias basadas en palabras clave del input
    if (input.includes('siembra') || input.includes('sembrar') || input.includes('plantar')) {
      return [
        '¿Cuándo es la mejor época para sembrar?',
        '¿Cómo preparo el suelo?',
        '¿Cuál es el espaciado ideal?',
        '¿Puedo plantar en macetas?'
      ]
    }
    
    if (input.includes('cosecha') || input.includes('cosechar') || input.includes('maduro')) {
      return [
        '¿Cómo sé cuándo está listo para cosechar?',
        '¿Cuánto tiempo tarda en crecer?',
        '¿Cómo sé si está maduro?'
      ]
    }
    
    if (input.includes('plaga') || input.includes('insecto') || input.includes('pulgón')) {
      return [
        '¿Qué plagas debo vigilar?',
        '¿Cómo combatir pulgones orgánicamente?',
        '¿Qué plantas repelen plagas?'
      ]
    }
    
    if (input.includes('agua') || input.includes('riego') || input.includes('humedad')) {
      return [
        '¿Cuánta agua necesita?',
        '¿Con qué frecuencia debo regar?',
        '¿Cómo sé si necesita agua?'
      ]
    }
    
    if (input.includes('sol') || input.includes('luz') || input.includes('sombra')) {
      return [
        '¿Necesita mucho sol?',
        '¿Puedo ponerlo en sombra?',
        '¿Cuántas horas de luz necesita?'
      ]
    }
    
    if (input.includes('maceta') || input.includes('contenedor') || input.includes('interior')) {
      return [
        '¿Puedo plantar en macetas?',
        '¿Qué tamaño de maceta necesita?',
        '¿Puedo cultivarlo en interior?'
      ]
    }
    
    // Si no hay coincidencias, devolver sugerencias generales
    return allSuggestions.slice(0, 4)
  }

  const [suggestions, setSuggestions] = useState<string[]>([])

  // Actualizar sugerencias cuando cambia el input
  useEffect(() => {
    if (inputText.trim()) {
      setSuggestions(getContextualSuggestions(inputText))
    } else {
      setSuggestions([
        '¿Cuándo es la mejor época para sembrar?',
        '¿Cómo sé cuándo está listo para cosechar?',
        '¿Qué plagas debo vigilar?',
        '¿Cuánta agua necesita?',
        '¿Puedo plantar en macetas?'
      ])
    }
  }, [inputText])

  // Inicializar mensajes en el cliente para evitar hidratación
  useEffect(() => {
    setMessages([{
      id: '1',
      text: `¡Hola! Soy tu asistente especialista en cultivos orgánicos. Puedo ayudarte con siembra, cuidados, plagas, cosecha y cualquier duda que tengas sobre cualquier verdura, fruta o planta. ¿En qué te puedo ayudar hoy?`,
      sender: 'ai',
      timestamp: new Date()
    }])
  }, [])

  // Generar índice aleatorio solo en el cliente
  useEffect(() => {
    const moreSuggestions = suggestions.slice(4)
    const randomIndex = Math.floor(Math.random() * moreSuggestions.length)
    setRandomSuggestionIndex(randomIndex)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inputText.trim() || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)

    try {
      // Construir el contexto para Ollama - completamente dinámico
      const context = `
Eres un experto agricultor orgánico especializado en cultivos. 
Responde de manera clara, práctica y amigable. Usa emojis cuando sea apropiado.

${verdura ? `INFORMACIÓN BÁSICA SOBRE ${verdura.nombre.toUpperCase()}:
- Temporada: ${verdura.temporada}
- Riego: ${verdura.riego}
- Sol: ${verdura.sol}
- Descripción: ${verdura.descripcion}

` : ''}PREGUNTA DEL USUARIO: ${userMessage.text}

IMPORTANTE: Responde sobre CUALQUIER verdura, fruta o planta que el usuario mencione. 
No necesitas que esté en una base de datos predefinida. Usa tu conocimiento general como experto agricultor orgánico.

Si el usuario pregunta sobre una planta específica (como tomate, lechuga, etc.), 
proporciona información detallada sobre:
- Época de siembra y cosecha
- Requerimientos de sol y agua
- Cuidados principales
- Plagas comunes y cómo combatirlas orgánicamente
- Compatibilidad con otros cultivos
- Tips para cultivo en macetas si aplica

Responde en español, de manera conversacional y práctica. Máximo 150 palabras.
`

      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'Gpt-oss:20b-cloud', // Usar el modelo que ya tienes instalado
          prompt: context,
          stream: false,
          options: {
            temperature: 0.7,
            max_tokens: 200
          }
        })
      })

      if (!response.ok) {
        throw new Error('Error al conectar con Ollama')
      }

      const data = await response.json()
      const aiResponse = data.response

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])

    } catch (error) {
      console.error('Error al generar respuesta:', error)
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: `Lo siento, no pude conectar con el asistente. Asegúrate de que Ollama esté corriendo en http://localhost:11434. Mientras tanto, aquí tienes información básica${verdura ? ` sobre ${verdura.nombre}: ${verdura.descripcion}` : ' sobre cultivos orgánicos'}`,
        sender: 'ai',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion)
    inputRef.current?.focus()
  }

  const handleMoreSuggestions = () => {
    const moreSuggestions = getContextualSuggestions(inputText)
    const randomSuggestion = moreSuggestions[Math.floor(Math.random() * moreSuggestions.length)]
    setInputText(randomSuggestion)
    inputRef.current?.focus()
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header del chat */}
      <div className="bg-gradient-to-r from-leaf-green to-sage-green text-white p-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🤖</span>
          <div>
            <h3 className="font-semibold">Asistente de Cultivos</h3>
            <p className="text-sm text-white/80">Experto en agricultura orgánica</p>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-leaf-green text-white shadow-md'
                  : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
              <p className={`text-xs mt-2 ${
                message.sender === 'user' ? 'text-green-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-leaf-green rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-leaf-green rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-leaf-green rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
                <span className="text-sm text-gray-600">Escribiendo...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Sugerencias */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="mb-3">
          <p className="text-sm text-gray-600 mb-3 font-medium">
            💡 {inputText.trim() ? 'Sugerencias relacionadas:' : 'Preguntas sugeridas:'}
          </p>
          <div className="grid grid-cols-1 gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-left bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm transition-colors border border-gray-200 hover:border-gray-300"
              >
                {suggestion}
              </button>
            ))}
          </div>
          {inputText.trim() && (
            <button
              onClick={handleMoreSuggestions}
              className="text-xs text-leaf-green hover:text-sage-green mt-2 underline"
            >
              ↻ Otras sugerencias
            </button>
          )}
        </div>

        {/* Formulario de input */}
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Pregunta sobre cultivos..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-green focus:border-transparent text-sm font-bold"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="bg-leaf-green text-white px-4 py-2 rounded-lg hover:bg-sage-green transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-leaf-green flex items-center space-x-2 shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Enviar</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
