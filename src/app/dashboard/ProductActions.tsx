// app/dashboard/ProductActions.tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Props {
  productId: number
}

export default function ProductActions({ productId }: Props) {
  const router = useRouter()

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (!confirm('Supprimer ce produit ?')) {
      return
    }

    try {
      // Appeler la route de suppression
      const response = await fetch(`/dashboard/supprimer/${productId}`, {
        method: 'GET',
      })
      
      if (response.ok) {
        // Rafraîchir les données sans recharger la page
        router.refresh()
      } else {
        console.error('Erreur suppression')
      }
    } catch (error) {
      console.error('Erreur:', error)
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
        className="text-red-600 hover:underline"
      >
        Supprimer
      </button>
    </div>
  )
}