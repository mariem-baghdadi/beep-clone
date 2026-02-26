// app/dashboard/modifier/[id]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ModifierProduitPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Attendre la résolution de params
  const { id } = await params
  
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/connexion')
  }

  // Conversion sécurisée en nombre
  const productId = parseInt(id)
  
  // Vérifier que c'est un nombre valide
  if (isNaN(productId)) {
    redirect('/dashboard?error=ID de produit invalide')
  }

  // Récupérer le produit
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .eq('user_id', user.id)
    .single()

  if (error || !product) {
    console.error('Produit non trouvé:', error)
    redirect('/dashboard?error=Produit non trouvé')
  }

  const categories = [
    'Fruits & Légumes',
    'Viandes & Poissons',
    'Produits laitiers',
    'Épicerie',
    'Boissons',
    'Surgelés',
    'Autre'
  ]

  async function updateProduct(formData: FormData) {
    'use server'
    
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      redirect('/auth/connexion')
    }

    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const barcode = formData.get('barcode') as string || null
    const expiry_date = formData.get('expiry_date') as string
    const category = formData.get('category') as string
    const notes = formData.get('notes') as string || null

    const { error } = await supabase
      .from('products')
      .update({
        name,
        barcode,
        expiry_date,
        category,
        notes,
      })
      .eq('id', parseInt(id))
      .eq('user_id', user.id)

    if (error) {
      console.error('Erreur modification:', error)
      redirect(`/dashboard/modifier/${id}?error=Erreur lors de la modification`)
    }

    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            ← Retour au dashboard
          </Link>
        </div>
        
        <div className="rounded-lg bg-white p-8 shadow">
          <h1 className="mb-6 text-2xl font-bold">Modifier le produit</h1>
          
          <form action={updateProduct} className="space-y-4">
            <input type="hidden" name="id" value={product.id} />
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nom du produit *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                defaultValue={product.name}
                className="mt-1 w-full rounded-lg border border-gray-300 p-2"
              />
            </div>
            
            <div>
              <label htmlFor="barcode" className="block text-sm font-medium text-gray-700">
                Code-barres
              </label>
              <input
                type="text"
                id="barcode"
                name="barcode"
                defaultValue={product.barcode || ''}
                className="mt-1 w-full rounded-lg border border-gray-300 p-2"
              />
            </div>
            
            <div>
              <label htmlFor="expiry_date" className="block text-sm font-medium text-gray-700">
                Date de péremption *
              </label>
              <input
                type="date"
                id="expiry_date"
                name="expiry_date"
                required
                defaultValue={product.expiry_date}
                className="mt-1 w-full rounded-lg border border-gray-300 p-2"
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Catégorie *
              </label>
              <select
                id="category"
                name="category"
                required
                defaultValue={product.category}
                className="mt-1 w-full rounded-lg border border-gray-300 p-2"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                defaultValue={product.notes || ''}
                className="mt-1 w-full rounded-lg border border-gray-300 p-2"
              />
            </div>
            
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Enregistrer
              </button>
              <Link
                href="/dashboard"
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