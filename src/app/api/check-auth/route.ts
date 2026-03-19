import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  return NextResponse.json({
    authenticated: !!user,
    user: user?.email,
    cookies: cookieStore.getAll().map(c => c.name),
    headers: Object.fromEntries(cookieStore.getAll().map(c => [c.name, 'present']))
  })
}