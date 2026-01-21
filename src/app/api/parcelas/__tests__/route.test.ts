import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { NextRequest } from 'next/server'
import ParcelaAPI from '@/app/api/parcelas/route'

// Mock de dependencias
jest.mock('@/lib/mongodb')
jest.mock('@/models/Parcela')
jest.mock('@/models/Usuario')
jest.mock('@/lib/cache')
jest.mock('@/lib/logger')

describe('Parcelas API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/parcelas', () => {
    it('debe retornar parcelas con paginación', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/parcelas?userId=test@example.com&page=1&limit=10')
      
      // Mock de respuesta exitosa
      const mockParcelas = [
        { _id: '1', nombre: 'Parcela 1', area: 10 },
        { _id: '2', nombre: 'Parcela 2', area: 15 },
      ]

      // Mock del fetch global
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          parcelas: mockParcelas,
          pagination: {
            page: 1,
            limit: 10,
            total: 2,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          },
          cached: false,
          timestamp: new Date().toISOString()
        })
      })

      const response = await ParcelaAPI.GET(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.parcelas).toEqual(mockParcelas)
      expect(data.pagination.page).toBe(1)
      expect(data.pagination.limit).toBe(10)
    })

    it('debe retornar error si no hay userId', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/parcelas?page=1&limit=10')
      
      const response = await ParcelaAPI.GET(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Usuario requerido')
    })

    it('debe validar parámetros de paginación', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/parcelas?userId=test@example.com&page=-1&limit=0')
      
      const response = await ParcelaAPI.GET(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Parámetros de paginación inválidos')
    })

    it('debe manejar filtros correctamente', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/parcelas?userId=test@example.com&estado=activa&tipo=huerto&busqueda=tomate')
      
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          parcelas: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
          cached: false,
          timestamp: new Date().toISOString()
        })
      })

      const response = await ParcelaAPI.GET(mockRequest)
      
      expect(response.status).toBe(200)
      expect(global.fetch).toHaveBeenCalled()
    })
  })

  describe('POST /api/parcelas', () => {
    it('debe crear parcela correctamente', async () => {
      const newParcela = {
        nombre: 'Nueva Parcela',
        area: 20,
        cultivos: ['tomate', 'lechuga'],
      }

      const mockRequest = new NextRequest('http://localhost:3000/api/parcelas', {
        method: 'POST',
        body: JSON.stringify(newParcela),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          _id: 'new-id',
          ...newParcela,
          createdAt: new Date().toISOString()
        })
      })

      const response = await ParcelaAPI.POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.nombre).toBe(newParcela.nombre)
      expect(data.area).toBe(newParcela.area)
    })

    it('debe validar datos requeridos', async () => {
      const incompleteParcela = {
        nombre: 'Parcela incompleta',
        // falta area
      }

      const mockRequest = new NextRequest('http://localhost:3000/api/parcelas', {
        method: 'POST',
        body: JSON.stringify(incompleteParcela),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({
          error: 'Todos los campos requeridos'
        })
      })

      const response = await ParcelaAPI.POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBeTruthy()
    })

    it('debe manejar creación automática', async () => {
      const autoParcela = {
        nombre: 'Parcela Automática',
        tipo: 'huerto',
        tamaño: 'mediano',
        plantas_deseadas: ['tomate'],
        usuario_id: 'user-123',
        configuracion_inicial: {
          generado_automaticamente: true,
          tiempo_mantenimiento: 'medio'
        }
      }

      const mockRequest = new NextRequest('http://localhost:3000/api/parcelas', {
        method: 'POST',
        body: JSON.stringify(autoParcela),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          _id: 'auto-id',
          ...autoParcela,
          generadoAutomaticamente: true
        })
      })

      const response = await ParcelaAPI.POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.generadoAutomaticamente).toBe(true)
    })
  })
})
