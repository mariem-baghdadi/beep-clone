// app/api/categories/[id]/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', parseInt(id))
      .eq('user_id', user.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)

  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const categoryId = parseInt(id)

    const { error } = await supabase
      .from('categories')
      .update({ name: body.name })
      .eq('id', categoryId)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const categoryId = parseInt(id)

    // Vérifier si c'est "Autre"
    const { data: cat } = await supabase
      .from('categories')
      .select('name')
      .eq('id', categoryId)
      .single()

    if (cat?.name === 'Autre') {
      return NextResponse.json(
        { error: 'La catégorie "Autre" ne peut pas être supprimée' },
        { status: 400 }
      )
    }

    // Trouver "Autre"
    const { data: autre } = await supabase
      .from('categories')
      .select('id')
      .eq('user_id', user.id)
      .eq('name', 'Autre')
      .single()

    if (autre) {
      await supabase
        .from('products')
        .update({ category_id: autre.id })
        .eq('category_id', categoryId)
        .eq('user_id', user.id)
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}