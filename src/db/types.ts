import type { ColumnType, Generated } from "kysely"

export interface Product {
  id: Generated<number>
  name: string
  price: number
  description: string
  currency: string
  interval: "day" | "week" | "month" | "year"
  stripe_product_id: string
  stripe_price_id: string
  created_at: ColumnType<Date, string | undefined, never>
}

export interface Database {
  products: Product
}
