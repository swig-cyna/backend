import { db } from "@/db"
import { GetOrderRoute, GetOrdersRoute } from "@/routes/orders/routes"
import type { AppRouteHandler } from "@/utils/types"
import { Status } from "better-status-codes"

export const getOrders: AppRouteHandler<GetOrdersRoute> = async (c) => {
  try {
    const orders = await db.selectFrom("order").selectAll().execute()

    const formattedOrders = await Promise.all(
      orders.map(async (order) => {
        const orderItems = await db
          .selectFrom("orderItem")
          .selectAll()
          .where("orderId", "=", order.id)
          .execute()

        const itemsWithProducts = await Promise.all(
          orderItems.map(async (item) => {
            const product = await db
              .selectFrom("products")
              .select(["name", "price"])
              .where("id", "=", item.productId)
              .executeTakeFirst()

            if (!product) {
              throw new Error(`Product with ID ${item.productId} not found`)
            }

            return {
              quantity: item.quantity,
              product: {
                name: product.name,
                price: product.price,
              },
            }
          }),
        )

        return {
          id: order.id,
          amount: order.amount,
          createdAt: order.createdAt,
          orderItem: itemsWithProducts,
        }
      }),
    )

    return c.json(formattedOrders, Status.OK)
  } catch (err) {
    console.error("Error while fetching formatted orders:", err)

    return c.json(
      { error: (err as Error).message },
      Status.INTERNAL_SERVER_ERROR,
    )
  }
}

export const getOrder: AppRouteHandler<GetOrderRoute> = async (c) => {
  try {
    const { id } = c.req.param()

    const orders = await db
      .selectFrom("order")
      .selectAll()
      .where("userId", "=", id)
      .execute()

    if (!orders) {
      return c.json({ error: "Order not found" }, Status.NOT_FOUND)
    }

    const formattedOrders = await Promise.all(
      orders.map(async (order) => {
        const orderItems = await db
          .selectFrom("orderItem")
          .selectAll()
          .where("orderId", "=", order.id)
          .execute()

        const itemsWithProducts = await Promise.all(
          orderItems.map(async (item) => {
            const product = await db
              .selectFrom("products")
              .select(["name", "price"])
              .where("id", "=", item.productId)
              .executeTakeFirst()

            if (!product) {
              throw new Error(`Product with ID ${item.productId} not found`)
            }

            return {
              quantity: item.quantity,
              product: {
                name: product.name,
                price: product.price,
              },
            }
          }),
        )

        return {
          id: order.id,
          amount: order.amount,
          createdAt: order.createdAt,
          orderItem: itemsWithProducts,
        }
      }),
    )

    return c.json(formattedOrders, Status.OK)
  } catch (err) {
    console.error("Error while fetching order:", err)

    return c.json(
      { error: (err as Error).message },
      Status.INTERNAL_SERVER_ERROR,
    )
  }
}
