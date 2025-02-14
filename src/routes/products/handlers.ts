import { db } from "@/db"
import type { AppRouteHandler } from "@/utils/types"
import { Status } from "better-status-codes"
import type { GetProductByIdRoute, GetProductsRoute } from "./routes"

export const getProducts: AppRouteHandler<GetProductsRoute> = async (c) => {
  const products = await db.selectFrom("products").selectAll().execute()

  console.log(products)

  return c.json(products)
}

export const getProduct: AppRouteHandler<GetProductByIdRoute> = async (c) => {
  const { id: rawId } = c.req.param()

  if (!rawId) {
    return c.json({ error: "Missing id" }, Status.BAD_REQUEST)
  }

  const id = Number(rawId)

  const product = await db
    .selectFrom("products")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst()

  if (!product) {
    return c.json({ error: "Product not found" }, Status.NOT_FOUND)
  }

  return c.json(product, Status.OK)
}
