// app/auth/connexion/page.tsx
import Link from "next/link"
import { signIn } from './actions'

export default async function ConnexionPage(props: {
  searchParams?: Promise<{ error?: string }>
}) {
  const searchParams = await props.searchParams
  const error = searchParams?.error

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        
        <h1 className="mb-2 text-3xl font-bold text-gray-800">Connexion</h1>
        <p className="mb-6 text-gray-600">Connectez-vous à votre compte</p>
        
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
        
        <form action={signIn} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
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
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            Se connecter
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Pas encore de compte ?{" "}
          <Link href="/auth/inscription" className="text-blue-600 hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </main>
  )
}