import { db } from "@/db"
import { sendPaymentReceiptEmail } from "@/emails/emailService"
import env from "@/env"
import { stripeClient } from "@/utils/stripe"
import type { AppRouteHandler } from "@/utils/types"
import { Status } from "better-status-codes"
import type { HandleStripeWebhookRoute } from "./routes"

export const handleStripeWebhook: AppRouteHandler<
  HandleStripeWebhookRoute
> = async (c) => {
  const rawBody = await c.req.raw.clone().text()
  const sig = c.req.header("stripe-signature")

  if (!sig) {
    return c.json({ error: "Signature manquante" }, Status.BAD_REQUEST)
  }

  let event = null

  try {
    event = stripeClient.webhooks.constructEvent(
      rawBody,
      sig,
      env.STRIPE_WEBHOOK_SECRET,
    )
  } catch (err) {
    console.error(`Webhook Error: ${(err as Error).message}`)

    return c.json(
      { error: `Webhook Error: ${(err as Error).message}` },
      Status.BAD_REQUEST,
    )
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object)

        break

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object)

        break

      default:
        console.log(`Événement non géré: ${event.type}`)
    }

    return c.json({ received: true }, Status.OK)
  } catch (error) {
    console.error(`Error processing webhook: ${(error as Error).message}`)

    return c.json({ received: true }, Status.OK)
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  try {
    if (
      !paymentIntent.metadata ||
      !paymentIntent.metadata.userId ||
      !paymentIntent.metadata.cartItems
    ) {
      console.error(
        "Métadonnées manquantes dans le PaymentIntent:",
        paymentIntent.id,
      )

      return
    }

    const { userId } = paymentIntent.metadata

    const cartItems = JSON.parse(paymentIntent.metadata.cartItems)

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      throw new Error("Format de panier invalide ou vide")
    }

    try {
      const [order] = await db
        .insertInto("order")
        .values({
          userId,
          amount: paymentIntent.amount / 100,
          status: "completed",
          paymentIntentId: paymentIntent.id,
        })
        .returningAll()
        .execute()

      const productIds = cartItems.map((item: any) => item.productId)

      const products = await db
        .selectFrom("products")
        .selectAll()
        .where("id", "in", productIds)
        .execute()

      const productMap = new Map(products.map((p) => [p.id, p]))

      const orderItems = []
      const orderItemPromises = cartItems.map(async (item) => {
        const product = productMap.get(item.productId)

        if (!product) {
          console.error(`Produit introuvable: ${item.productId}`)

          return null
        }

        const [orderItem] = await db
          .insertInto("orderItem")
          .values({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
          })
          .returningAll()
          .execute()

        return {
          ...orderItem,
          name: product.name,
        }
      })

      const resolvedOrderItems = await Promise.all(orderItemPromises)
      const filteredItems = resolvedOrderItems.filter((item) => item !== null)
      orderItems.push(...filteredItems)

      const user = await db
        .selectFrom("user")
        .selectAll()
        .where("id", "=", userId)
        .executeTakeFirst()

      if (user) {
        const orderDetails = {
          orderNumber: order.id.toString(),
          items: orderItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          total: paymentIntent.amount / 100,
          date: new Date().toLocaleDateString("fr-FR"),
        }

        await sendPaymentReceiptEmail(user.email, user.name, orderDetails)
      }
    } catch (trxError) {
      console.error("Erreur lors de la création de la commande:", trxError)
      throw trxError
    }
  } catch (error) {
    console.error(
      `Erreur lors du traitement du paiement réussi: ${(error as Error).message}`,
    )
  }
}

async function handlePaymentIntentFailed(paymentIntent: any) {
  try {
    await db
      .updateTable("payment")
      .set({
        status: paymentIntent.status,
      })
      .where("stripePaymentIntentId", "=", paymentIntent.id)
      .execute()
  } catch (error) {
    console.error(
      `Erreur lors du traitement du paiement échoué: ${(error as Error).message}`,
    )
  }
}
