// app/auth/inscription/actions.ts
'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signUp(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    // Message plus convivial pour la limite d'emails
    if (error.message.includes('rate_limit') || error.message.includes('limit')) {
      redirect('/auth/inscription?error= Trop de tentatives. Veuillez attendre quelques minutes avant de réessayer.')
    }
    redirect(`/auth/inscription?error=${encodeURIComponent(error.message)}`)
  }

  // Vérifier si l'utilisateur a besoin de confirmer son email
  if (data.user?.identities?.length === 0) {
    redirect('/auth/inscription?error= Cet email est déjà utilisé')
  }

  // Si la confirmation email est désactivée, l'utilisateur est automatiquement connecté
  if (data.session) {
    redirect('/dashboard')
  }

  // Sinon, rediriger vers la page de vérification
  redirect('/auth/verification-email')
}