// app/dashboard/ajouter/page.tsx
import { redirect } from 'next/navigation'
import AjouterProduitForm from './AjouterProduitForm'
import { createClient } from '@/lib/supabase/server'

// Catégories prédéfinies (peuvent être déplacées dans un fichier partagé)
const categories = [
  'Fruits & Légumes',
  'Viandes & Poissons',
  'Produits laitiers',
  'Épicerie',
  'Boissons',
  'Surgelés',
  'Autre'
]

export default async function AjouterProduitPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/connexion')
  }

  async function addProduct(formData: FormData) {
    'use server'
    
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      redirect('/auth/connexion')
    }

    const name = formData.get('name') as string
    const barcode = formData.get('barcode') as string || null
    const expiry_date = formData.get('expiry_date') as string
    const category = formData.get('category') as string
    const notes = formData.get('notes') as string || null

    const { error } = await supabase
      .from('products')
      .insert({
        name,
        barcode,
        expiry_date,
        category,
        notes,
        user_id: user.id
      })

    if (error) {
      console.error('Erreur ajout:', error)
      redirect('/dashboard/ajouter?error=Erreur lors de l\'ajout')
    }

    redirect('/dashboard')
  }

  return (
    <AjouterProduitForm 
      addProduct={addProduct}
      categories={categories}
    />
  )
}