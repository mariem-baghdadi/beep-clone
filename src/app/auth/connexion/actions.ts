// app/auth/connexion/actions.ts
'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export async function signIn(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  console.log('Tentative de connexion pour:', email)

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Erreur connexion:', error.message)
    redirect(`/auth/connexion?error=${encodeURIComponent(error.message)}`)
  }

  console.log('Connexion réussie pour:', data.user?.email)
  redirect('/dashboard')
}