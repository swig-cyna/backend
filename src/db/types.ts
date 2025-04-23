import type { ColumnType, Generated } from "kysely"

export interface ProductImage {
  id: Generated<number>
  product_id: number
  file: string
  created_at: ColumnType<Date, string | undefined, never>
  updated_at: ColumnType<Date, string | undefined, never>
}

export interface CarouselSlide {
  id: Generated<number>
  title: string
  description: string
  image: string
  link: string
  position: number
  created_at?: ColumnType<Date, string | undefined, never>
  updated_at?: ColumnType<Date, string | undefined, never>
}

export interface Category {
  id: Generated<number>
  name: string
  color: string
  created_at?: ColumnType<Date, string | undefined, never>
  updated_at?: ColumnType<Date, string | undefined, never>
}

export interface Product {
  id: Generated<number>
  name: string
  price: number
  description: string
  currency: string
  interval: "day" | "week" | "month" | "year"
  category_id: number | null
  stripe_product_id: string
  stripe_price_id: string
  created_at: ColumnType<Date, string | undefined, never>
}

export interface User {
  id: Generated<string>
  stripeCustomerId: string | null
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  createdAt: Date
  updatedAt: Date
  role: string
  banned: boolean
  banReason: string | null
  banExpires: number | null
  twoFactorEnabled: boolean
}

export interface TwoFactor {
  id: Generated<string>
  userId: string
  secret: string
  backupCodes: string
}

export interface Account {
  id: Generated<string>
  accountId: string
  providerId: string
  userId: string
  accessToken: string | null
  refreshToken: string | null
  idToken: string | null
  accessTokenExpiresAt: Date | null
  refreshTokenExpiresAt: Date | null
  scope: string | null
  password: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  id: Generated<string>
  expiresAt: Date
  token: string
  createdAt: Date
  updatedAt: Date
  ipAddress: string | null
  userAgent: string | null
  userId: string
  impersonatedBy: string | null
}

export interface Verification {
  id: Generated<string>
  identifier: string
  value: string
  expiresAt: Date
  createdAt: Date | null
  updatedAt: Date | null
}

export interface TicketTable {
  id: Generated<number>
  title: string
  description: string
  theme: string
  status: "open" | "in_progress" | "closed"
  user_id: string
  user_name: string
  user_email: string
  assigned_to: string | null
  created_at: ColumnType<Date, string, never>
  updated_at: ColumnType<Date, string | undefined, Date | string | undefined>
  closed_at: ColumnType<Date | null, string | null, never>
}

export interface Subscription {
  id: Generated<number>
  userId: string
  productId: number
  stripeCustomerId: string
  stripeSubscriptionId: string
  status: string
  currentPeriodEnd: Date
  createdAt: Generated<Date>
  updatedAt: Generated<Date>
  canceledAt: Date | null
  quantity: number
}

export interface Payment {
  id: Generated<number>
  userId: string
  stripeCustomerId: string
  stripePaymentIntentId: string
  status: string
  amount: number
  quantity: number
  createdAt: Generated<Date>
  updatedAt: Generated<Date>
  completedAt: Date | null
}

export interface OrderItem {
  id: Generated<number>
  orderId: number
  productId: number
  quantity: number
  price: number
  createdAt: Generated<Date>
  updatedAt: Generated<Date>
}

export interface Order {
  id: Generated<number>
  userId: string
  amount: number
  status: string
  paymentIntentId: string
  createdAt: Generated<Date>
  updatedAt: Generated<Date>
}

export interface Address {
  id: Generated<number>
  user_id: string
  alias: string
  line1: string
  line2: string | null
  city: string
  postal_code: string
  country: string
  created_at: ColumnType<Date, never, never>
  updated_at: ColumnType<Date, never, never>
}

export interface Database {
  products: Product
  user: User
  twoFactor: TwoFactor
  account: Account
  session: Session
  verification: Verification
  carousel: CarouselSlide
  ticket: TicketTable
  subscription: Subscription
  product_images: ProductImage
  payment: Payment
  order: Order
  orderItem: OrderItem
  categories: Category
  address: Address
}
