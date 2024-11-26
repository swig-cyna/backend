import { relations } from "drizzle-orm"
import { integer, pgTable, serial } from "drizzle-orm/pg-core"
import users from "./users"

const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  userId: serial("user_id")
    .references(() => users.id)
    .notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer().notNull(),
})

export const cartsRelations = relations(carts, ({ one }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
}))

export default carts
