import Header from '@/components/Header'
import PerfilClient from '@/components/PerfilClient'

export default async function PerfilPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <PerfilClient />
    </div>
  )
}