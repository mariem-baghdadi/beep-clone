// app/api/products/[id]/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // Vérifier l'authentification
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const productId = parseInt(id)
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'ID de produit invalide' },
        { status: 400 }
      )
    }

    // Supprimer le produit
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Erreur suppression:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}