import type { ColumnType, Generated } from "kysely"

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

export interface User {
  id: Generated<string>
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

export interface Database {
  products: Product
  user: User
  twoFactor: TwoFactor
  account: Account
  session: Session
  verification: Verification
  carousel: CarouselSlide
}
