import { db } from "@/db"
import type { AppRouteHandler } from "@/utils/types"
import { Status } from "better-status-codes"
import { stripeClient } from "@/utils/stripe"
import type { AttachPaymentMethodRoute, GetPaymentMethodsRoute } from "./routes"

export const attachPaymentMethod: AppRouteHandler<
  AttachPaymentMethodRoute
> = async (c) => {
  try {
    const { userId, paymentMethodId } = c.req.valid("json")
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

    await stripeClient.paymentMethods.attach(paymentMethodId, {
      customer: user.stripeCustomerId,
    })

    return c.json({ message: "Payment methode attach successfully" }, Status.OK)
  } catch (err) {
    console.error("Erreur lors de la création du moyen de paiement:", err)

    return c.json(
      { error: (err as Error).message },
      Status.INTERNAL_SERVER_ERROR,
    )
  }
}

export const getPaymentMethods: AppRouteHandler<
  GetPaymentMethodsRoute
> = async (c) => {
  try {
    const { id } = c.req.param()

    const user = await db
      .selectFrom("user")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst()

    if (!user) {
      return c.json({ error: "User not found" }, Status.NOT_FOUND)
    } else if (!user.stripeCustomerId) {
      return c.json(
        { error: "User does not have a Stripe customer ID" },
        Status.NOT_FOUND,
      )
    }

    const paymentMethods = await stripeClient.customers.listPaymentMethods(
      user.stripeCustomerId,
    )

    return c.json(paymentMethods, Status.OK)
  } catch (err) {
    console.error("Erreur lors de la création du moyen de paiement:", err)

    return c.json(
      { error: (err as Error).message },
      Status.INTERNAL_SERVER_ERROR,
    )
  }
}
