import winston from 'winston'

// Niveles de log personalizados
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}

// Colores para cada nivel
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
}

winston.addColors(colors)

// Formato personalizado para logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
)

// Formato para producción (JSON)
const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
)

// Transportadores
const transports = [
  // Consola para desarrollo
  new winston.transports.Console({
    format: process.env.NODE_ENV === 'production' ? jsonFormat : format,
  }),
  
  // Archivo de errores
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    format: jsonFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
  
  // Archivo de todos los logs
  new winston.transports.File({
    filename: 'logs/combined.log',
    format: jsonFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
]

// Crear el logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  levels,
  format: jsonFormat,
  transports,
  exitOnError: false,
})

// Logger personalizado con metadatos adicionales
export class Logger {
  private static generateRequestId(): string {
    return Math.random().toString(36).substring(2, 15)
  }

  // Log de error con contexto completo
  static error(message: string, meta?: any) {
    logger.error(message, {
      ...meta,
      service: 'greenrouse-api',
      requestId: this.generateRequestId(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    })
  }

  // Log de advertencia
  static warn(message: string, meta?: any) {
    logger.warn(message, {
      ...meta,
      service: 'greenrouse-api',
      requestId: this.generateRequestId(),
      timestamp: new Date().toISOString(),
    })
  }

  // Log informativo
  static info(message: string, meta?: any) {
    logger.info(message, {
      ...meta,
      service: 'greenrouse-api',
      requestId: this.generateRequestId(),
      timestamp: new Date().toISOString(),
    })
  }

  // Log de HTTP requests
  static http(message: string, meta?: any) {
    logger.http(message, {
      ...meta,
      service: 'greenrouse-api',
      requestId: this.generateRequestId(),
      timestamp: new Date().toISOString(),
    })
  }

  // Log de debug
  static debug(message: string, meta?: any) {
    logger.debug(message, {
      ...meta,
      service: 'greenrouse-api',
      requestId: this.generateRequestId(),
      timestamp: new Date().toISOString(),
    })
  }

  // Log para acciones de usuario
  static userAction(action: string, userId: string, meta?: any) {
    logger.info(`User Action: ${action}`, {
      action,
      userId,
      ...meta,
      service: 'greenrouse-api',
      requestId: this.generateRequestId(),
      timestamp: new Date().toISOString(),
      category: 'user_action',
    })
  }

  // Log para performance
  static performance(operation: string, duration: number, meta?: any) {
    logger.info(`Performance: ${operation}`, {
      operation,
      duration,
      ...meta,
      service: 'greenrouse-api',
      requestId: this.generateRequestId(),
      timestamp: new Date().toISOString(),
      category: 'performance',
    })
  }

  // Log para eventos de negocio
  static business(event: string, meta?: any) {
    logger.info(`Business Event: ${event}`, {
      event,
      ...meta,
      service: 'greenrouse-api',
      requestId: this.generateRequestId(),
      timestamp: new Date().toISOString(),
      category: 'business',
    })
  }

  // Log para seguridad
  static security(event: string, meta?: any) {
    logger.warn(`Security Event: ${event}`, {
      event,
      ...meta,
      service: 'greenrouse-api',
      requestId: this.generateRequestId(),
      timestamp: new Date().toISOString(),
      category: 'security',
    })
  }

  // Log para caché
  static cache(action: string, key: string, hit: boolean, meta?: any) {
    logger.info(`Cache ${action}: ${key}`, {
      action,
      key,
      hit,
      ...meta,
      service: 'greenrouse-api',
      requestId: this.generateRequestId(),
      timestamp: new Date().toISOString(),
      category: 'cache',
    })
  }

  // Log para base de datos
  static database(operation: string, collection: string, duration: number, meta?: any) {
    logger.info(`DB ${operation}: ${collection}`, {
      operation,
      collection,
      duration,
      ...meta,
      service: 'greenrouse-api',
      requestId: this.generateRequestId(),
      timestamp: new Date().toISOString(),
      category: 'database',
    })
  }

  // Wrapper para funciones con medición de performance
  static async withTiming<T>(
    operation: string,
    fn: () => Promise<T>,
    meta?: any
  ): Promise<T> {
    const start = Date.now()
    const requestId = this.generateRequestId()
    
    try {
      this.debug(`Starting ${operation}`, { requestId, ...meta })
      const result = await fn()
      const duration = Date.now() - start
      
      this.performance(operation, duration, {
        requestId,
        status: 'success',
        ...meta
      })
      
      return result
    } catch (error) {
      const duration = Date.now() - start
      
      this.error(`Error in ${operation}`, {
        requestId,
        duration,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        status: 'error',
        ...meta
      })
      
      throw error
    }
  }

  // Obtener estadísticas del logger
  static getStats() {
    return {
      level: logger.level,
      transports: logger.transports.length,
      environment: process.env.NODE_ENV,
    }
  }
}

export default Logger
