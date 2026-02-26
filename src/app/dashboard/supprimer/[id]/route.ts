// app/dashboard/supprimer/[id]/route.ts
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    console.error('ID invalide:', id)
    redirect('/dashboard?error=ID de produit invalide')
  }

  // Supprimer le produit
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Erreur suppression:', error)
    redirect('/dashboard?error=Erreur lors de la suppression')
  }
  revalidatePath('/dashboard');
  redirect('/dashboard')
}