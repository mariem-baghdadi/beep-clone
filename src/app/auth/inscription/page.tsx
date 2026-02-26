// app/auth/inscription/page.tsx
import Link from "next/link"
import { signUp } from './actions'

// Le composant devient async
export default async function InscriptionPage(props: {
  searchParams?: Promise<{ error?: string }>
}) {
  // On attend la résolution de la Promise searchParams
  const searchParams = await props.searchParams
  const error = searchParams?.error

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        
        <h1 className="mb-2 text-3xl font-bold text-gray-800">Inscription</h1>
        <p className="mb-6 text-gray-600">Créez votre compte pour commencer</p>
        
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
        
        <form action={signUp} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 w-full rounded-lg text-gray-700 border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              placeholder="vous@exemple.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              minLength={6}
              className="mt-1 w-full rounded-lg text-gray-700 border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            S'inscrire
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Déjà un compte ?{" "}
          <Link href="/auth/connexion" className="text-blue-600 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  )
}