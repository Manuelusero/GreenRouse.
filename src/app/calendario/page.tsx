import { redirect } from 'next/navigation'

// Calendario lunar eliminado — datos hardcodeados a Oct-Nov 2024
// Redirigir al blog donde se publicarán artículos de calendario lunar
export default function CalendarioPage() {
  redirect('/blog')
}
