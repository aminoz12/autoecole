import AdminLoginForm from '@/components/admin/AdminLoginForm'

export const metadata = {
  title: 'Connexion Admin - AutoEcole Pro',
  description: 'Accédez à votre espace d\'administration',
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <AdminLoginForm />
    </main>
  )
}


