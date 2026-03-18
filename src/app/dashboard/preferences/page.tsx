// app/dashboard/preferences/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PreferencesForm from '@/components/PreferencesForm'

export default async function PreferencesPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/connexion')
  }

  // Récupérer les préférences existantes
  const { data: preferences, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Si pas de préférences, en créer
  if (!preferences) {
    const { data: newPrefs } = await supabase
      .from('user_preferences')
      .insert({
        user_id: user.id,
        notification_email: user.email
      })
      .select()
      .single()
    
    return (
      <PreferencesForm 
        user={user} 
        preferences={newPrefs || {
          notifications_enabled: true,
          notify_7_days: true,
          notify_3_days: true,
          notify_1_day: true,
          notification_email: user.email
        }} 
      />
    )
  }

  return <PreferencesForm user={user} preferences={preferences} />
}