'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signIn(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('❌ Erreur connexion:', error.message)
    redirect(`/auth/connexion?error=${encodeURIComponent(error.message)}`)
  }
  // Vérifier les cookies après connexion
  const cookieStore = await cookies()
  console.log('🍪 Cookies après connexion:', cookieStore.getAll().map(c => c.name))
  
  // Pas besoin de logs, ils apparaîtront dans Vercel si la route est appelée
  redirect('/dashboard')
}