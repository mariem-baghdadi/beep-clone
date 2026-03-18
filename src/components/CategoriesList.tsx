// app/dashboard/categories/CategoriesList.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Category } from '@/lib/types/category'

interface Props {
  categories: Category[]
  productCount: Record<number, number>
}

export default function CategoriesList({ categories, productCount }: Props) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (id: number, name: string) => {
    if (name === 'Autre') {
      alert('La catégorie "Autre" ne peut pas être supprimée')
      return
    }

    if (!confirm(`Supprimer "${name}" ? Les produits seront déplacés dans "Autre".`)) {
      return
    }

    setDeletingId(id)

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      alert('Erreur de connexion')
    } finally {
      setDeletingId(null)
    }
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-lg bg-white p-12 text-center shadow">
        <p className="text-gray-600">Aucune catégorie</p>
        <Link
          href="/dashboard/categories/nouvelle"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          Créer une catégorie
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {categories.map((cat) => (
        <div key={cat.id} className="rounded-lg bg-white p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{cat.name}</h3>
              <p className="text-sm text-gray-500">
                {productCount[cat.id] || 0} produit(s)
              </p>
            </div>
            <div className="flex space-x-2">
              <Link
                href={`/dashboard/categories/${cat.id}`}
                className="rounded bg-blue-50 px-3 py-1 text-sm text-blue-600 hover:bg-blue-100"
              >
                Modifier
              </Link>
              {cat.name !== 'Autre' && (
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  disabled={deletingId === cat.id}
                  className="rounded bg-red-50 px-3 py-1 text-sm text-red-600 hover:bg-red-100 disabled:opacity-50"
                >
                  {deletingId === cat.id ? '...' : 'Supprimer'}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}