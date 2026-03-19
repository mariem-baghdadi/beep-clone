// app/dashboard/categories/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CategoriesList from '@/components/CategoriesList'

export default async function CategoriesPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/connexion')
  }

  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', user.id)
    .order('name')

  if (error) {
    console.error('Erreur chargement catégories:', error)
  }

  // Compter les produits par catégorie
  const { data: products } = await supabase
    .from('products')
    .select('category_id')

  const productCount: Record<number, number> = {}
  products?.forEach((p: { category_id: number }) => {
    if (p.category_id) {
      productCount[p.category_id] = (productCount[p.category_id] || 0) + 1
    }
  })

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/dashboard" className="text-blue-600 hover:underline">
              ← Retour
            </Link>
            <h1 className="mt-4 text-3xl font-bold">Catégories</h1>
          </div>
          
          <Link
            href="/dashboard/categories/nouvelle"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            + Nouvelle catégorie
          </Link>
        </div>

        <CategoriesList 
          categories={categories || []} 
          productCount={productCount}
        />
      </div>
    </main>
  )
}