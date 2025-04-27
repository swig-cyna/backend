import { db } from "@/db"
import {
  GetOrderRoute,
  GetOrdersRoute,
  UpdateBillingAddressRoute,
  UpdateShippingAddressRoute,
} from "@/routes/orders/routes"
import type { AppRouteHandler } from "@/utils/types"
import { Status } from "better-status-codes"

const getFullOrderData = async (orderId: number) =>
  await db
    .selectFrom("order")
    .leftJoin("user as u", "order.userId", "u.id")
    .select([
      "order.id",
      "order.amount",
      "order.createdAt",
      "order.status as paymentStatus",
      "u.name as customerName",
      "order.shipping_address",
      "order.billing_address",
    ])
    .where("order.id", "=", orderId)
    .executeTakeFirstOrThrow()

const getOrderItemsWithProducts = async (orderId: number) => {
  const orderItems = await db
    .selectFrom("orderItem")
    .selectAll()
    .where("orderId", "=", orderId)
    .execute()

  return await Promise.all(
    orderItems.map(async (item) => {
      const product = await db
        .selectFrom("products")
        .select(["name", "price"])
        .where("id", "=", item.productId)
        .executeTakeFirst()

      return {
        quantity: item.quantity,
        product: {
          name: product?.name || "Deleted product",
          price: product?.price || 0,
        },
      }
    }),
  )
}

export const getOrders: AppRouteHandler<GetOrdersRoute> = async (c) => {
  try {
    const orders = await db
      .selectFrom("order")
      .leftJoin("user as u", "order.userId", "u.id")
      .select([
        "order.id",
        "order.amount",
        "order.createdAt",
        "order.status as paymentStatus",
        "u.name as customerName",
        "order.shipping_address",
        "order.billing_address",
      ])
      .execute()

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
                name: product?.name || "Deleted product",
                price: product?.price || 0,
              },
            }
          }),
        )

        return {
          ...order,
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

export const updateShippingAddress: AppRouteHandler<
  UpdateShippingAddressRoute
> = async (c) => {
  const { id } = c.req.param()
  const addressData = await c.req.json()

  try {
    await db
      .updateTable("order")
      .set({
        shipping_address: addressData,
      })
      .where("id", "=", Number(id))
      .execute()

    const fullOrder = await getFullOrderData(Number(id))
    const orderItems = await getOrderItemsWithProducts(Number(id))

    return c.json(
      {
        ...fullOrder,
        orderItem: orderItems,
      },
      Status.OK,
    )
  } catch (err) {
    console.error("Update shipping address error:", err)

    return c.json({ error: "Commande introuvable" }, Status.NOT_FOUND)
  }
}

export const updateBillingAddress: AppRouteHandler<
  UpdateBillingAddressRoute
> = async (c) => {
  const { id } = c.req.param()
  const addressData = await c.req.json()

  try {
    await db
      .updateTable("order")
      .set({
        billing_address: addressData,
      })
      .where("id", "=", Number(id))
      .execute()

    const fullOrder = await getFullOrderData(Number(id))
    const orderItems = await getOrderItemsWithProducts(Number(id))

    return c.json(
      {
        ...fullOrder,
        orderItem: orderItems,
      },
      Status.OK,
    )
  } catch (err) {
    console.error("Update billing address error:", err)

    return c.json({ error: "Commande introuvable" }, Status.NOT_FOUND)
  }
}
