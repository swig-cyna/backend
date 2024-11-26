import { relations } from "drizzle-orm"
import { pgTable, serial, varchar } from "drizzle-orm/pg-core"
import { z } from "zod"
import carts from "./cart"

const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstname: varchar("first_name", { length: 255 }).notNull(),
  lastname: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
  carts: many(carts, { relationName: "user_carts" }),
}))

export const usersResponseSchema = z.object({
  id: z.number(),
  firstname: z.string(),
  lastname: z.string(),
  email: z.string(),
})

export default users
