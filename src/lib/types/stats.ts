// lib/types/stats.ts
export type DashboardStats = {
  totalProducts: number
  expiredCount: number
  expiringToday: number
  expiringThisWeek: number
  expiringNextWeek: number
  byCategory: {
    name: string
    count: number
    color: string
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