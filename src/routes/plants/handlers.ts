import { db } from "@/db"
import { stripeClient } from "@/utils/stripe"
import type { AppRouteHandler } from "@/utils/types"
import { Status } from "better-status-codes"
import type {
  CreatePlantRoute,
  deletePlantRoute,
  GetPlantRoute,
  GetPlantsRoute,
  updatePlantRoute,
} from "./routes"

export const getPlants: AppRouteHandler<GetPlantsRoute> = async (c) => {
  const plants = await db.selectFrom("plants").selectAll().execute()

  return c.json(plants)
}

export const getPlant: AppRouteHandler<GetPlantRoute> = async (c) => {
  const { id: rawId } = c.req.param()

  const id = Number(rawId)

  const [plant] = await db
    .selectFrom("plants")
    .selectAll()
    .where("id", "=", id)
    .execute()

  return c.json(plant, Status.OK)
}

export const createPlant: AppRouteHandler<CreatePlantRoute> = async (c) => {
  try {
    const { name, price, discount, description, interval } = c.req.valid("json")

    const stripeProduct = await stripeClient.products.create({
      name,
      description,
    })

    const stripePrice = await stripeClient.prices.create({
      product: stripeProduct.id,
      unit_amount: Math.round(price * 1.2 * 100),
      currency: "eur",
      recurring: { interval },
    })

    const newProduct = await db
      .insertInto("plants")
      .values({
        name,
        price,
        discount,
        description,
        interval,
        stripe_product_id: stripeProduct.id,
        stripe_price_id: stripePrice.id,
      })
      .returningAll()
      .executeTakeFirst()

    if (!newProduct) {
      return c.json(
        { error: "Failed to create product" },
        Status.INTERNAL_SERVER_ERROR,
      )
    }

    return c.json(newProduct, Status.CREATED)
  } catch (err) {
    console.error("Erreur lors de la création du produit:", err)

    return c.json(
      { error: (err as Error).message },
      Status.INTERNAL_SERVER_ERROR,
    )
  }
}

export const updatePlant: AppRouteHandler<updatePlantRoute> = async (c) => {
  try {
    const { id: rawId } = c.req.param()
    const id = Number(rawId)

    if (isNaN(id)) {
      return c.json({ error: "Invalid id" }, Status.BAD_REQUEST)
    }

    const updates = c.req.valid("json")

    const plant = await db
      .selectFrom("plants")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst()

    if (!plant) {
      return c.json({ error: "Product not found" }, Status.NOT_FOUND)
    }

    const stripeProduct = await stripeClient.products.update(
      plant.stripe_product_id,
      {
        name: updates.name,
        description: updates.description,
      },
    )

    await stripeClient.prices.update(plant.stripe_price_id, { active: false })

    const stripePrice = await stripeClient.prices.create({
      product: stripeProduct.id,
      unit_amount: Math.round(updates.price * 1.2 * 100),
      currency: "eur",
      recurring: { interval: updates.interval },
    })

    const updatedProduct = await db
      .updateTable("plants")
      .set({
        name: updates.name,
        price: updates.price,
        discount: updates.discount,
        description: updates.description,
        interval: updates.interval,
        stripe_price_id: stripePrice.id,
      })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst()

    return c.json(updatedProduct, Status.OK)
  } catch (err) {
    console.error("Erreur lors de la modification du produit:", err)

    return c.json(
      { error: (err as Error).message },
      Status.INTERNAL_SERVER_ERROR,
    )
  }
}

export const deletePlant: AppRouteHandler<deletePlantRoute> = async (c) => {
  try {
    const { id: rawId } = c.req.param()
    const id = Number(rawId)

    if (!id) {
      return c.json({ error: "Missing id" }, Status.BAD_REQUEST)
    }

    if (isNaN(id)) {
      return c.json({ error: "Invalid id" }, Status.BAD_REQUEST)
    }

    const deletedPlant = await db
      .deleteFrom("plants")
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst()

    if (!deletedPlant) {
      return c.json({ error: "Product not found" }, Status.NOT_FOUND)
    }

    await stripeClient.products.update(deletedPlant.stripe_product_id, {
      active: false,
    })

    return c.json(deletedPlant, Status.OK)
  } catch (err) {
    console.error("Erreur lors de la suppression du produit:", err)

    return c.json(
      { error: (err as Error).message },
      Status.INTERNAL_SERVER_ERROR,
    )
  }
}
