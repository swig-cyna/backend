import type { Generated } from "kysely"

export interface Product {
  id: Generated<number>
  name: string
  price: number
  description: string
  created_at: Date
}

export interface Database {
  products: Product
}
