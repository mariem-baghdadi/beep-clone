// app/dashboard/categories/nouvelle/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NouvelleCategoriePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/dashboard/categories')
        router.refresh()
      } else {
        setError(data.error || 'Erreur lors de la création')
      }
    } catch (error) {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-md">
        <div className="mb-6">
          <Link href="/dashboard/categories" className="text-blue-600 hover:underline">
            ← Retour
          </Link>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h1 className="mb-6 text-2xl font-bold">Nouvelle catégorie</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom de la catégorie
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 p-2"
                placeholder="Ex: Surgelés, Épicerie..."
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Créer'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}