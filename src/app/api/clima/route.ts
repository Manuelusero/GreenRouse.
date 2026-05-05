import { NextRequest, NextResponse } from 'next/server'
import Logger from '@/lib/logger'

// Tipos para la respuesta de OpenWeatherMap
interface WeatherData {
  main: {
    temp: number
    humidity: number
    feels_like: number
  }
  weather: Array<{
    main: string
    description: string
    icon: string
  }>
  name: string
  sys: {
    country: string
  }
  coord: {
    lat: number
    lon: number
  }
}

interface ClimateInfo {
  temperatura: number
  descripcion: string
  humedad: number
  tipoClima: 'tropical' | 'subtropical' | 'templado' | 'frio' | 'desertico'
  ciudad: string
  pais: string
  coordenadas: {
    lat: number
    lon: number
  }
}

/**
 * Determina el tipo de clima basado en la temperatura y humedad
 */
function determinarTipoClima(temp: number, humidity: number, description: string): ClimateInfo['tipoClima'] {
  // Convertir temperatura de Kelvin a Celsius si es necesario
  const tempC = temp > 200 ? temp - 273.15 : temp
  
  // Lógica para determinar tipo de clima
  if (tempC >= 24 && humidity >= 60) {
    return 'tropical'
  } else if (tempC >= 18 && tempC < 24) {
    return 'subtropical'
  } else if (tempC >= 10 && tempC < 18) {
    return 'templado'
  } else if (tempC < 10) {
    return 'frio'
  } else if (humidity < 30 && tempC > 20) {
    return 'desertico'
  } else {
    return 'templado' // Por defecto
  }
}

// GET /api/clima?ciudad=Buenos Aires&pais=AR
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ciudad = searchParams.get('ciudad')
    const pais = searchParams.get('pais')
    
    if (!ciudad) {
      return NextResponse.json({
        success: false,
        error: 'Ciudad es requerida'
      }, { status: 400 })
    }

    // API key de OpenWeatherMap (necesitarás obtener una gratis)
    const API_KEY = process.env.OPENWEATHER_API_KEY || 'demo_key'
    
    // Si no hay API key, devolver datos simulados
    if (!API_KEY || API_KEY === 'demo_key') {
      
      // Datos simulados basados en ubicaciones conocidas
      const datosSimulados: Record<string, ClimateInfo> = {
        'buenos aires': {
          temperatura: 18,
          descripcion: 'Parcialmente nublado',
          humedad: 65,
          tipoClima: 'subtropical',
          ciudad: 'Buenos Aires',
          pais: 'Argentina',
          coordenadas: { lat: -34.61, lon: -58.38 }
        },
        'pergamino': {
          temperatura: 20,
          descripcion: 'Soleado',
          humedad: 70,
          tipoClima: 'subtropical',
          ciudad: 'Pergamino',
          pais: 'Argentina',
          coordenadas: { lat: -33.89, lon: -60.57 }
        },
        'mexico city': {
          temperatura: 22,
          descripcion: 'Templado',
          humedad: 55,
          tipoClima: 'templado',
          ciudad: 'Ciudad de México',
          pais: 'México',
          coordenadas: { lat: 19.43, lon: -99.13 }
        },
        'madrid': {
          temperatura: 16,
          descripcion: 'Templado',
          humedad: 50,
          tipoClima: 'templado',
          ciudad: 'Madrid',
          pais: 'España',
          coordenadas: { lat: 40.42, lon: -3.70 }
        }
      }
      
      const ciudadKey = ciudad.toLowerCase()
      const datosClima = datosSimulados[ciudadKey] || datosSimulados['buenos aires']
      
      return NextResponse.json({
        success: true,
        data: datosClima,
        source: 'simulado'
      })
    }

    // Construir URL de la API
    const query = pais ? `${ciudad},${pais}` : ciudad
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&appid=${API_KEY}&units=metric&lang=es`
    
    // Hacer petición a OpenWeatherMap
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'GreenRouse/1.0'
      }
    })

    if (!response.ok) {
      throw new Error(`Error de API de clima: ${response.status}`)
    }

    const weatherData: WeatherData = await response.json()
    
    // Procesar datos climáticos
    const climateInfo: ClimateInfo = {
      temperatura: Math.round(weatherData.main.temp),
      descripcion: weatherData.weather[0].description,
      humedad: weatherData.main.humidity,
      tipoClima: determinarTipoClima(
        weatherData.main.temp,
        weatherData.main.humidity,
        weatherData.weather[0].description
      ),
      ciudad: weatherData.name,
      pais: weatherData.sys.country,
      coordenadas: {
        lat: weatherData.coord.lat,
        lon: weatherData.coord.lon
      }
    }

    return NextResponse.json({
      success: true,
      data: climateInfo,
      source: 'openweathermap'
    })

  } catch (error) {
    Logger.error('GET /api/clima error', {
      error: error instanceof Error ? error.message : String(error)
    })
    
    // Obtener parámetros nuevamente para el fallback
    const { searchParams: fallbackParams } = new URL(request.url)
    const fallbackCiudad = fallbackParams.get('ciudad')
    const fallbackPais = fallbackParams.get('pais')
    
    // Devolver datos por defecto en caso de error
    return NextResponse.json({
      success: false,
      error: 'Error obteniendo datos climáticos',
      data: {
        temperatura: 20,
        descripcion: 'Templado',
        humedad: 60,
        tipoClima: 'templado',
        ciudad: fallbackCiudad || 'Ciudad desconocida',
        pais: fallbackPais || 'País desconocido',
        coordenadas: { lat: 0, lon: 0 }
      },
      source: 'fallback'
    }, { status: 200 })
  }
}