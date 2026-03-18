// app/dashboard/categories/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function ModifierCategoriePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/categories/${id}`)
        const data = await response.json()
        
        if (response.ok) {
          setName(data.name)
        } else {
          setError(data.error || 'Erreur chargement')
        }
      } catch (error) {
        setError('Erreur de connexion')
      } finally {
        setFetching(false)
      }
    }

    fetchCategory()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/dashboard/categories')
        router.refresh()
      } else {
        setError(data.error || 'Erreur lors de la modification')
      }
    } catch (error) {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-md text-center">Chargement...</div>
      </main>
    )
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
          <h1 className="mb-6 text-2xl font-bold">Modifier la catégorie</h1>

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
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Modification...' : 'Modifier'}
              </button>
              <Link
                href="/dashboard/categories"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-center text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}