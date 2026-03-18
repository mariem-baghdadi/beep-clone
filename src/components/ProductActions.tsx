// components/ProductActions.tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  productId: number
}

export default function ProductActions({ productId }: Props) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Supprimer ce produit ?')) return
    
    setIsDeleting(true)
    
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok) {
        // Rafraîchir la page pour voir les changements
        router.refresh()
      } else {
        alert(data.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur de connexion')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="mt-3 flex justify-end gap-2 border-t pt-2 text-xs">
      <Link
        href={`/dashboard/modifier/${productId}`}
        className="text-blue-600 hover:underline"
      >
        Modifier
      </Link>
      <span className="text-gray-300">|</span>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-red-600 hover:underline disabled:opacity-50"
      >
        {isDeleting ? 'Suppression...' : 'Supprimer'}
      </button>
    </div>
  )
}