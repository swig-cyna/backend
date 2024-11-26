import type { dbType } from "@/db"
import bcrypt from "bcrypt"
import * as schema from "../schema"
import users from "./data/users.json"

export default async function seed(db: dbType) {
  await Promise.all(
    users.map(async (user) => {
      const [insertedUser] = await db
        .insert(schema.users)
        .values({
          ...user,
          password: await bcrypt.hash(user.password, 10),
        })
        .returning()
      await Promise.all(
        user.cart.map(async (cart) => {
          await db.insert(schema.carts).values({
            ...cart,
            userId: insertedUser.id,
            productId: cart.productId,
          })
        })
      )
    })
  )
}
