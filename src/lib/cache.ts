import Redis from 'ioredis'
import Logger from '@/lib/logger'

// Configuración de Redis con fallback
class RedisClient {
  private static instance: Redis | null = null
  private static isConnected = false

  static getInstance(): Redis | null {
    if (!this.instance && !this.isConnected) {
      try {
        const redisUrl = process.env.REDIS_URL || process.env.REDIS_HOST
        
        if (!redisUrl) {
          Logger.warn('Redis no configurado. Usando fallback sin caché.')
          return null
        }

        this.instance = new Redis(redisUrl, {
          maxRetriesPerRequest: 3,
          lazyConnect: true,
          // Configuración para desarrollo/producción
          family: 4,
          keepAlive: 30000,
          connectTimeout: 10000,
          commandTimeout: 5000,
        })

        // Event listeners
        this.instance.on('connect', () => {
          Logger.info('Redis conectado exitosamente')
          this.isConnected = true
        })

        this.instance.on('error', (error) => {
          Logger.error('Error en Redis', { error: error instanceof Error ? error.message : error })
          this.isConnected = false
        })

        this.instance.on('close', () => {
          Logger.warn('Conexión Redis cerrada')
          this.isConnected = false
        })

        this.instance.on('reconnecting', () => {
          Logger.info('Redis reconectando...')
        })

      } catch (error) {
        Logger.error('Error inicializando Redis', { error: error instanceof Error ? error.message : error })
        this.instance = null
        this.isConnected = false
      }
    }

    return this.instance
  }

  static async disconnect(): Promise<void> {
    if (this.instance) {
      await this.instance.quit()
      this.instance = null
      this.isConnected = false
    }
  }

  static isReady(): boolean {
    return this.isConnected && !!this.instance
  }
}

// Cache service con TTLs inteligentes
export class CacheService {
  private static redis = RedisClient.getInstance()

  // TTLs en segundos
  private static readonly TTL = {
    parcelas: 300,        // 5 minutos - datos que cambian frecuentemente
    usuario: 3600,        // 1 hora - datos de usuario
    clima: 1800,          // 30 minutos - datos meteorológicos
    recomendaciones: 7200, // 2 horas - recomendaciones estáticas
    asociaciones: 86400,  // 24 horas - datos de asociaciones (cambian poco)
    onboarding: 1800,     // 30 minutos - datos de onboarding
    api_response: 60,     // 1 minuto - respuestas genéricas de API
  }

  // Generar clave de caché
  private static getKey(namespace: string, identifier: string): string {
    return `greenrouse:${namespace}:${identifier}`
  }

  // Obtener datos del caché
  static async get<T>(namespace: string, key: string): Promise<T | null> {
    if (!this.redis) return null

    try {
      const cacheKey = this.getKey(namespace, key)
      const cached = await this.redis.get(cacheKey)
      
      if (cached) {
        const data = JSON.parse(cached)
        Logger.debug(`Cache HIT: ${namespace}:${key}`)
        return data
      }
      
      Logger.debug(`Cache MISS: ${namespace}:${key}`)
      return null
    } catch (error) {
      Logger.error(`Error obteniendo caché ${namespace}:${key}`, { error: error instanceof Error ? error.message : error })
      return null
    }
  }

  // Guardar datos en caché
  static async set(namespace: string, key: string, data: any, customTTL?: number): Promise<boolean> {
    if (!this.redis) return false

    try {
      const cacheKey = this.getKey(namespace, key)
      const ttl = customTTL || this.TTL[namespace as keyof typeof this.TTL] || 300
      
      await this.redis.setex(cacheKey, ttl, JSON.stringify(data))
      Logger.debug(`Cache SET: ${namespace}:${key} (TTL: ${ttl}s)`)
      return true
    } catch (error) {
      Logger.error(`Error guardando caché ${namespace}:${key}`, { error: error instanceof Error ? error.message : error })
      return false
    }
  }

  // Eliminar clave específica
  static async del(namespace: string, key: string): Promise<boolean> {
    if (!this.redis) return false

    try {
      const cacheKey = this.getKey(namespace, key)
      await this.redis.del(cacheKey)
      Logger.debug(`Cache DEL: ${namespace}:${key}`)
      return true
    } catch (error) {
      Logger.error(`Error eliminando caché ${namespace}:${key}`, { error: error instanceof Error ? error.message : error })
      return false
    }
  }

  // Invalidar caché por patrón
  static async invalidatePattern(pattern: string): Promise<boolean> {
    if (!this.redis) return false

    try {
      const fullPattern = `greenrouse:${pattern}`
      const keys = await this.redis.keys(fullPattern)
      
      if (keys.length > 0) {
        await this.redis.del(...keys)
        Logger.debug(`Cache INVALIDATED: ${pattern} (${keys.length} keys)`)
      }
      
      return true
    } catch (error) {
      Logger.error(`Error invalidando caché ${pattern}`, { error: error instanceof Error ? error.message : error })
      return false
    }
  }

  // Invalidar caché de usuario específico
  static async invalidateUser(userId: string): Promise<boolean> {
    const patterns = [
      `parcelas:user_${userId}:*`,
      `usuario:${userId}`,
      `onboarding:${userId}`,
      `recomendaciones:user_${userId}:*`
    ]

    for (const pattern of patterns) {
      await this.invalidatePattern(pattern)
    }

    return true
  }

  // Cache wrapper para funciones asíncronas
  static async wrap<T>(
    namespace: string,
    key: string,
    fn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    // Intentar obtener del caché
    const cached = await this.get<T>(namespace, key)
    if (cached) return cached

    // Ejecutar función y cachear resultado
    try {
      const result = await fn()
      await this.set(namespace, key, result, ttl)
      return result
    } catch (error) {
      Logger.error(`Error en cache wrapper ${namespace}:${key}`, { error: error instanceof Error ? error.message : error })
      throw error
    }
  }

  // Estadísticas del caché
  static async getStats(): Promise<{
    connected: boolean
    memory?: string
    keys?: number
    info?: any
  }> {
    if (!this.redis) {
      return { connected: false }
    }

    try {
      const info = await this.redis.info('memory')
      const dbSize = await this.redis.dbsize()
      
      return {
        connected: true,
        memory: info.split('\r\n').find(line => line.includes('used_memory_human'))?.split(':')[1],
        keys: dbSize,
        info: info
      }
    } catch (error) {
      Logger.error('Error obteniendo estadísticas de Redis', { error: error instanceof Error ? error.message : error })
      return { connected: false }
    }
  }

  // Health check
  static async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy'
    latency?: number
    error?: string
  }> {
    if (!this.redis) {
      return { status: 'unhealthy', error: 'Redis no configurado' }
    }

    try {
      const start = Date.now()
      await this.redis.ping()
      const latency = Date.now() - start
      
      return {
        status: 'healthy',
        latency
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }
}

export default CacheService
