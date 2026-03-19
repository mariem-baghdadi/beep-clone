// app/api/dashboard/stats/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer tous les produits avec leurs catégories
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          name
        )
      `)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const in7Days = new Date(today)
    in7Days.setDate(in7Days.getDate() + 7)
    
    const in14Days = new Date(today)
    in14Days.setDate(in14Days.getDate() + 14)

    // Compter par catégorie
    const categoryCount: Record<string, number> = {}
    products?.forEach((p: any) => {
      const catName = p.categories?.name || 'Autre'
      categoryCount[catName] = (categoryCount[catName] || 0) + 1
    })

    const byCategory = Object.entries(categoryCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    // Compter les produits expirés
    const expiredCount = products?.filter((p: any) => 
      new Date(p.expiry_date) < today
    ).length || 0

    // Compter les produits qui expirent aujourd'hui
    const expiringToday = products?.filter((p: any) => {
      const date = new Date(p.expiry_date)
      return date.toDateString() === today.toDateString()
    }).length || 0

    // Compter cette semaine (hors aujourd'hui)
    const expiringThisWeek = products?.filter((p: any) => {
      const date = new Date(p.expiry_date)
      return date > today && date <= in7Days
    }).length || 0

    // Compter semaine prochaine
    const expiringNextWeek = products?.filter((p: any) => {
      const date = new Date(p.expiry_date)
      return date > in7Days && date <= in14Days
    }).length || 0

    // Prochaines échéances groupées par jour
    const nextDays: Record<string, any[]> = {}
    
    products
      ?.filter((p: any) => new Date(p.expiry_date) >= today)
      .sort((a: any, b: any) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime())
      .slice(0, 10)
      .forEach((p: any) => {
        const dateStr = p.expiry_date
        if (!nextDays[dateStr]) {
          nextDays[dateStr] = []
        }
        const daysLeft = Math.ceil(
          (new Date(p.expiry_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        )
        nextDays[dateStr].push({
          id: p.id,
          name: p.name,
          daysLeft
        })
      })

    const nextExpirations = Object.entries(nextDays).map(([date, products]) => ({
      date,
      products
    }))

    return NextResponse.json({
      totalProducts: products?.length || 0,
      expiredCount,
      expiringToday,
      expiringThisWeek,
      expiringNextWeek,
      byCategory,
      nextExpirations
    })

  } catch (error) {
    console.error('Erreur stats:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}