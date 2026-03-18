// src/component/DashboardStats.tsx
'use client'

import { useEffect, useState } from 'react'

type Stats = {
  totalProducts: number
  expiredCount: number
  expiringToday: number
  expiringThisWeek: number
  expiringNextWeek: number
  byCategory: {
    name: string
    count: number
  }[]
  nextExpirations: {
    date: string
    products: {
      id: number
      name: string
      daysLeft: number
    }[]
  }[]
}

const CATEGORY_COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f97316', '#8b5cf6', 
  '#ec4899', '#06b6d4', '#eab308', '#6b7280'
]

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Erreur chargement stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-200 sm:h-24"></div>
        ))}
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Cartes statistiques */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-gray-100 sm:p-4">
          <p className="text-xs text-gray-500 sm:text-sm">Total</p>
          <p className="text-xl font-bold text-gray-800 sm:text-2xl">{stats.totalProducts}</p>
        </div>
        
        <div className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-gray-100 sm:p-4">
          <p className="text-xs text-gray-500 sm:text-sm">Expirés</p>
          <p className="text-xl font-bold text-red-600 sm:text-2xl">{stats.expiredCount}</p>
        </div>
        
        <div className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-gray-100 sm:p-4">
          <p className="text-xs text-gray-500 sm:text-sm">Aujourd'hui</p>
          <p className="text-xl font-bold text-orange-600 sm:text-2xl">{stats.expiringToday}</p>
        </div>
        
        <div className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-gray-100 sm:p-4">
          <p className="text-xs text-gray-500 sm:text-sm">Cette semaine</p>
          <p className="text-xl font-bold text-blue-600 sm:text-2xl">{stats.expiringThisWeek}</p>
        </div>
      </div>

      {/* Message si tout va bien */}
      {stats.expiringThisWeek === 0 && stats.expiringToday === 0 && (
        <div className="rounded-lg border border-green-100 bg-green-50/50 p-3 sm:p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 sm:h-10 sm:w-10">
              <span className="text-sm sm:text-base">🌿</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-600 sm:text-base">
                <span className="font-medium text-gray-800">Semaine tranquille</span>
                <span className="mx-2 hidden text-gray-300 sm:inline">•</span>
                <span className="block text-xs text-gray-500 sm:inline sm:text-sm">
                  {stats.totalProducts} produit{stats.totalProducts > 1 ? 's' : ''} en stock
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section catégories */}
      {stats.byCategory.length > 0 && (
        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-5">
          <h3 className="mb-3 text-sm font-medium text-gray-700 sm:text-base">
            Répartition par catégorie
          </h3>
          <div className="space-y-3">
            {stats.byCategory.map((cat, index) => (
              <div key={cat.name} className="flex items-center gap-2">
                <span className="w-20 truncate text-xs text-gray-600 sm:w-24 sm:text-sm">
                  {cat.name}
                </span>
                <div className="flex-1">
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 sm:h-2">
                    <div
                      className="h-1.5 rounded-full transition-all sm:h-2"
                      style={{
                        width: `${(cat.count / stats.totalProducts) * 100}%`,
                        backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length]
                      }}
                    />
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-800 sm:text-sm">
                  {cat.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}