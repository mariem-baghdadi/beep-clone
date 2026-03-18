// components/ProductCard.tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface ProductCardProps {
  product: {
    id: number
    name: string
    expiry_date: string
    barcode?: string | null
    categories?: { name: string } | null
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Supprimer ce produit ?')) return

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Erreur suppression:', error)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR')
  }

  const isExpired = new Date(product.expiry_date) < new Date()

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-medium text-gray-800 sm:text-lg">
            {product.name}
          </h3>
          <span className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {product.categories?.name || 'Autre'}
          </span>
        </div>
        <span className={`self-start whitespace-nowrap rounded-full px-2 py-1 text-xs font-medium ${
          isExpired 
            ? 'bg-red-100 text-red-600'
            : 'bg-green-100 text-green-600'
        }`}>
          {formatDate(product.expiry_date)}
        </span>
      </div>
      
      {product.barcode && (
        <p className="mt-3 truncate text-xs text-gray-400">
          📦 {product.barcode}
        </p>
      )}
      
      <div className="mt-4 flex items-center justify-end gap-4 border-t pt-3 text-sm">
        <Link
          href={`/dashboard/modifier/${product.id}`}
          className="text-gray-500 transition hover:text-blue-600"
        >
          Modifier
        </Link>
        <span className="text-gray-300">|</span>
        <button
          onClick={handleDelete}
          className="text-gray-500 transition hover:text-red-600"
        >
          Supprimer
        </button>
      </div>
    </div>
  )
}