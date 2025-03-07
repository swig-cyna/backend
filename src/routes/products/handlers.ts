import { db } from "@/db"
import type { AppRouteHandler } from "@/utils/types"
import { Status } from "better-status-codes"
import Stripe from "stripe"
import type {
  GetProductByIdRoute,
  GetProductsRoute,
  CreateProductRoute,
} from "./routes"
import env from "@/env"

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-01-27.acacia",
})

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

export const createProduct: AppRouteHandler<CreateProductRoute> = async (c) => {
  try {
    const { name, price, description, currency, interval } = c.req.valid("json")

    const stripeProduct = await stripe.products.create({ name, description })

    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: Math.round(price * 100),
      currency,
      recurring: { interval },
    })

    const [newProduct] = await db
      .insertInto("products")
      .values({
        name,
        price,
        description,
        currency,
        interval,
        stripe_product_id: stripeProduct.id,
        stripe_price_id: stripePrice.id,
      })
      .returningAll()
      .execute()

    return c.json(newProduct, Status.CREATED)
  } catch (err) {
    console.error("Erreur lors de la création du produit:", err)

    return c.json(
      { error: (err as Error).message },
      Status.INTERNAL_SERVER_ERROR,
    )
  }
}
