// src/component/AjouterProduitForm.tsx
'use client'

import { useState, useEffect } from 'react'
import BarcodeScanner from '@/components/BarcodeScanner'
import Link from 'next/link'

interface Props {
  addProduct: (formData: FormData) => Promise<void>
}

export default function AjouterProduitForm({ addProduct }: Props) {
  const [showScanner, setShowScanner] = useState(false)
  const [barcode, setBarcode] = useState('')
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error('Erreur chargement catégories:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  return (
    <>
      {showScanner && (
        <BarcodeScanner
          onScan={(result) => {
            setBarcode(result)
            setShowScanner(false)
          }}
          onClose={() => setShowScanner(false)}
        />
      )}

      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-2xl">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            ← Retour
          </Link>
          
          <div className="mt-6 rounded-lg bg-white p-8 shadow">
            <h1 className="mb-6 text-2xl font-bold">Ajouter un produit</h1>
            
            <form action={addProduct} className="space-y-4">
              {/* Code-barres */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Code-barres
                </label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    name="barcode"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 p-2"
                    placeholder="Scannez ou saisissez le code"
                  />
                  <button
                    type="button"
                    onClick={() => setShowScanner(true)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    Scanner
                  </button>
                </div>
              </div>
              
              {/* Nom */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2"
                  placeholder="Ex: Lait demi-écrémé"
                />
              </div>
              
              {/* Date */}
              <div>
                <label htmlFor="expiry_date" className="block text-sm font-medium text-gray-700">
                  Date de péremption *
                </label>
                <input
                  type="date"
                  id="expiry_date"
                  name="expiry_date"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2"
                />
              </div>
              
              {/* Catégorie */}
              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                  Catégorie *
                </label>
                {loading ? (
                  <div className="mt-1 h-10 animate-pulse rounded-lg bg-gray-200"></div>
                ) : (
                  <select
                    id="category_id"
                    name="category_id"
                    required
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
                <div className="mt-1 text-right">
                  <Link
                    href="/dashboard/categories/nouvelle"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    + Nouvelle catégorie
                  </Link>
                </div>
              </div>
              
              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2"
                  placeholder="Informations supplémentaires..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Ajouter le produit
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}