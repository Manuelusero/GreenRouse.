export interface Verdura {
  id: string
  nombre: string
  emoji: string
  descripcion: string
  temporada: string
  riego: string
  sol: string
}

// Base de datos básica - puedes expandirla con más verduras
export const verdurasData: Verdura[] = [
  {
    id: 'tomate',
    nombre: 'Tomate',
    emoji: '🍅',
    descripcion: 'El clásico de cualquier huerta. Versátil y productivo.',
    temporada: 'Primavera-Verano',
    riego: 'Regular',
    sol: '6-8 horas'
  },
  {
    id: 'lechuga',
    nombre: 'Lechuga',
    emoji: '🥬',
    descripcion: 'Crecimiento rápido y fácil. Ideal para principiantes.',
    temporada: 'Otoño-Primavera',
    riego: 'Frecuente',
    sol: '4-6 horas'
  },
  {
    id: 'zanahoria',
    nombre: 'Zanahoria',
    emoji: '🥕',
    descripcion: 'Raíz dulce y nutritiva. Requiere suelo suelto.',
    temporada: 'Primavera-Otoño',
    riego: 'Moderado',
    sol: '6 horas'
  },
  {
    id: 'pimiento',
    nombre: 'Pimiento',
    emoji: '🫑',
    descripcion: 'Colorido y versátil. Necesita calor constante.',
    temporada: 'Verano',
    riego: 'Regular',
    sol: '8 horas'
  },
  {
    id: 'berenjena',
    nombre: 'Berenjena',
    emoji: '🍆',
    descripcion: 'Exótica y deliciosa. Requiere cuidados especiales.',
    temporada: 'Verano',
    riego: 'Regular',
    sol: '8 horas'
  },
  {
    id: 'pepino',
    nombre: 'Pepino',
    emoji: '🥒',
    descripcion: 'Fresco y productivo. Perfecto para optimizar espacio.',
    temporada: 'Verano',
    riego: 'Frecuente',
    sol: '6-8 horas'
  },
  {
    id: 'rabano',
    nombre: 'Rábano',
    emoji: '🫘',
    descripcion: 'Ultra rápido y fácil. Cosecha en semanas.',
    temporada: 'Primavera-Otoño',
    riego: 'Moderado',
    sol: '4-6 horas'
  },
  {
    id: 'espinaca',
    nombre: 'Espinaca',
    emoji: '🌿',
    descripcion: 'Superfood nutritiva y de rápido crecimiento.',
    temporada: 'Otoño-Primavera',
    riego: 'Regular',
    sol: '4-6 horas'
  },
  {
    id: 'cebolla',
    nombre: 'Cebolla',
    emoji: '🧅',
    descripcion: 'Base fundamental en la cocina. Almacenable.',
    temporada: 'Primavera-Otoño',
    riego: 'Moderado',
    sol: '6 horas'
  },
  {
    id: 'ajo',
    nombre: 'Ajo',
    emoji: '🧄',
    descripcion: 'Medicinal y culinario. Se siembra en otoño.',
    temporada: 'Otoño-Invierno',
    riego: 'Moderado',
    sol: '6 horas'
  },
  {
    id: 'brocoli',
    nombre: 'Brócoli',
    emoji: '🥦',
    descripcion: 'Nutritivo y productivo. Produce brotes laterales.',
    temporada: 'Primavera-Otoño',
    riego: 'Regular',
    sol: '6 horas'
  },
  {
    id: 'calabacin',
    nombre: 'Calabacín',
    emoji: '🥒',
    descripcion: 'Extremadamente productivo. Ideal para principiantes.',
    temporada: 'Verano',
    riego: 'Regular',
    sol: '8 horas'
  }
]
