import { db } from "@/db"
import { stripeClient } from "@/utils/stripe"
import type { AppRouteHandler } from "@/utils/types"
import { Status } from "better-status-codes"
import type {
  ConfirmPaymentRoute,
  CreatePaymentIntentRoute,
  GetPaymentRoute,
  GetPaymentsRoute,
} from "./routes"

export const createPaymentIntent: AppRouteHandler<
  CreatePaymentIntentRoute
> = async (c) => {
  try {
    const { userId, cartItems, paymentMethodId } = c.req.valid("json")

    const user = await db
      .selectFrom("user")
      .selectAll()
      .where("id", "=", userId)
      .executeTakeFirst()

    if (!user) {
      return c.json({ error: "User not found" }, Status.NOT_FOUND)
    } else if (!user.stripeCustomerId) {
      return c.json(
        { error: "User does not have a Stripe customer ID" },
        Status.NOT_FOUND,
      )
    }

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return c.json({ error: "Cart is empty" }, Status.BAD_REQUEST)
    }

    const productIds = cartItems.map((item) => item.productId)

    const products = await db
      .selectFrom("products")
      .selectAll()
      .where("id", "in", productIds)
      .execute()

    if (products.length !== productIds.length) {
      return c.json({ error: "Some products not found" }, Status.NOT_FOUND)
    }

    const productMap = new Map(products.map((p) => [p.id, p]))

    let totalAmount = 0
    cartItems.forEach((item) => {
      const product = productMap.get(item.productId)

      if (!product) {
        throw new Error(`Product not found: ${item.productId}`)
      }

      const itemAmount = product.price * item.quantity
      totalAmount += itemAmount
    })

    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: "eur",
      customer: user.stripeCustomerId,
      payment_method: paymentMethodId,
      confirm: false,
      setup_future_usage: "off_session",
      metadata: {
        userId,
        itemsCount: cartItems.length.toString(),
        cartItems: JSON.stringify(
          cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        ),
      },
    })

    const [newPayment] = await db
      .insertInto("payment")
      .values({
        userId,
        stripeCustomerId: user.stripeCustomerId,
        stripePaymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        amount: totalAmount,
        quantity: cartItems.reduce((acc, item) => acc + item.quantity, 0),
      })
      .returningAll()
      .execute()

    if (!paymentIntent.client_secret) {
      return c.json(
        { error: "Client secret not found" },
        Status.INTERNAL_SERVER_ERROR,
      )
    }

    return c.json(
      {
        clientSecret: paymentIntent.client_secret,
        paymentId: newPayment.id,
      },
      Status.CREATED,
    )
  } catch (err) {
    console.error("Erreur lors de la création de l'intention de paiement:", err)

    return c.json(
      { error: (err as Error).message },
      Status.INTERNAL_SERVER_ERROR,
    )
  }
}

export const confirmPayment: AppRouteHandler<ConfirmPaymentRoute> = async (
  c,
) => {
  try {
    const { paymentIntentId } = c.req.valid("json")

    const paymentIntent =
      await stripeClient.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== "succeeded") {
      return c.json(
        {
          error: "Le paiement n'a pas été complété",
        },
        Status.BAD_REQUEST,
      )
    }

    await db
      .updateTable("payment")
      .set({
        status: paymentIntent.status,
        completedAt: new Date(),
      })
      .where("stripePaymentIntentId", "=", paymentIntentId)
      .execute()

    if (paymentIntent.status === "succeeded") {
      const existingOrder = await db
        .selectFrom("order")
        .selectAll()
        .where("paymentIntentId", "=", paymentIntent.id)
        .executeTakeFirst()

      if (existingOrder) {
        return c.json(
          {
            success: true,
            message: "Paiement réussi",
            order: existingOrder,
          },
          Status.OK,
        )
      }

      return handleNewOrder(paymentIntent, c)
    }

    async function handleNewOrder(data: any, macron: any) {
      const cartItemsData = JSON.parse(data.metadata.cartItems || "[]")
      const totalAmount = data.amount / 100

      try {
        const [order] = await db
          .insertInto("order")
          .values({
            userId: data.metadata.userId,
            amount: totalAmount,
            status: "completed",
            paymentIntentId: data.id,
          })
          .returningAll()
          .execute()

        if (cartItemsData.length > 0) {
          await createOrderItems(cartItemsData, order.id)
        }

        return macron.json(
          {
            success: true,
            message: "Paiement réussi",
            order,
          },
          Status.OK,
        )
      } catch (trxError) {
        console.error("Erreur lors de la création de la commande:", trxError)
        throw trxError
      }
    }

    async function createOrderItems(cartItemsData: any[], orderId: number) {
      const orderItemPromises = cartItemsData.map(
        async (item: { productId: number; quantity: number }) => {
          const product = await db
            .selectFrom("products")
            .selectAll()
            .where("id", "=", item.productId)
            .executeTakeFirst()

          if (product) {
            return db
              .insertInto("orderItem")
              .values({
                orderId,
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
              })
              .execute()
          }

          return null
        },
      )

      await Promise.all(orderItemPromises)
    }

    return c.json(
      {
        success: false,
        message: `Le statut du paiement est: ${paymentIntent.status}`,
      },
      Status.BAD_REQUEST,
    )
  } catch (err) {
    console.error("Erreur lors de la confirmation du paiement:", err)

    return c.json(
      { error: (err as Error).message },
      Status.INTERNAL_SERVER_ERROR,
    )
  }
}

export const getPayments: AppRouteHandler<GetPaymentsRoute> = async (c) => {
  const payments = await db.selectFrom("payment").selectAll().execute()

  return c.json(payments)
}

export const getPayment: AppRouteHandler<GetPaymentRoute> = async (c) => {
  const { id } = c.req.param()

  const payment = await db
    .selectFrom("payment")
    .selectAll()
    .where("id", "=", Number(id))
    .executeTakeFirst()

  if (!payment) {
    return c.json({ error: "Payment not found" }, Status.NOT_FOUND)
  }

  const dataPaymentIntent = await stripeClient.paymentIntents.retrieve(
    payment.stripePaymentIntentId,
  )

  return c.json({ dataPaymentIntent }, Status.OK)
}
