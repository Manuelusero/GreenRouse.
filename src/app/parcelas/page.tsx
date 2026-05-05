import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import ParcelasPageContent from '@/components/ParcelasPageContent'

type PageProps = { searchParams: Promise<{ mode?: string; from?: string }> }

export default async function ParcelasPage({ searchParams }: PageProps) {
  const params = await searchParams
  const isLocalMode = params.mode === 'local'

  const session = await getServerSession()

  // Solo redirigir a login si no hay sesión Y no es modo local
  if (!session && !isLocalMode) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ParcelasPageContent
        userEmail={session?.user?.email || ''}
        localMode={isLocalMode && !session}
      />
      <Footer />
    </div>
  )
}