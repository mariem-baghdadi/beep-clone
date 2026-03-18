// app/api/user/preferences/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Vérifier l'authentification
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer les données
    const body = await request.json()
    
    // Préparer les données (simplifié)
    const preferences = {
      user_id: user.id,
      notifications_enabled: body.notifications_enabled ?? true,
      notify_7_days: body.notify_7_days ?? true,
      notify_3_days: body.notify_3_days ?? true,
      notify_1_day: body.notify_1_day ?? true,
      notification_email: body.notification_email || user.email,
      updated_at: new Date().toISOString()
    }

    console.log('📝 Sauvegarde pour user:', user.id, preferences)

    // Tentative d'insertion directe
    const { error } = await supabase
      .from('user_preferences')
      .upsert(preferences, { 
        onConflict: 'user_id',
        ignoreDuplicates: false 
      })

    if (error) {
      console.error('❌ Erreur Supabase:', error)
      return NextResponse.json({ 
        error: error.message,
        details: error
      }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('❌ Erreur générale:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { data: preferences, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Retourner les préférences ou les valeurs par défaut
    return NextResponse.json(preferences || {
      notifications_enabled: true,
      notify_7_days: true,
      notify_3_days: true,
      notify_1_day: true,
      notification_email: user.email
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}