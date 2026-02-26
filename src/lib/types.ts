// lib/types.ts
export type Product = {
  id: number
  created_at: string
  name: string
  barcode: string | null
  expiry_date: string
  category: string
  user_id: string
  notes: string | null
}

export type ProductFormData = {
  name: string
  barcode?: string
  expiry_date: string
  category: string
  notes?: string
}