// app/auth/connexion/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function signIn(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  console.log('🔑 Tentative connexion:', email)

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('❌ Erreur connexion:', error)
    redirect(`/auth/connexion?error=${encodeURIComponent(error.message)}`)
  }

  console.log('✅ Connexion réussie:', data.user?.email)
  
  // Force la sauvegarde des cookies
  const cookieStore = await cookies()
  console.log('📦 Cookies après connexion:', cookieStore.getAll())
  
  redirect('/dashboard')
}