import { db } from "@/db"
import type { AppRouteHandler } from "@/utils/types"
import { Status } from "better-status-codes"
import { stripeClient } from "@/utils/stripe"
import type {
  CreateSubscriptionRoute,
  GetSubscriptionsRoute,
  CancelSubscriptionRoute,
  GetSubscriptionRoute,
} from "./routes"

export const createSubscription: AppRouteHandler<
  CreateSubscriptionRoute
> = async (c) => {
  try {
    const { userId, priceId, quantity } = c.req.valid("json")

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

    const subscription = await stripeClient.subscriptions.create({
      customer: user.stripeCustomerId,
      items: [{ price: priceId, quantity }],
    })

    const [newSubscription] = await db
      .insertInto("subscription")
      .values({
        userId,
        stripeCustomerId: user.stripeCustomerId,
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        quantity,
      })
      .returningAll()
      .execute()

    return c.json(newSubscription, Status.CREATED)
  } catch (err) {
    console.error("Erreur lors de la création de l'abonnement:", err)

    return c.json(
      { error: (err as Error).message },
      Status.INTERNAL_SERVER_ERROR,
    )
  }
}

export const getSubscriptions: AppRouteHandler<GetSubscriptionsRoute> = async (
  c,
) => {
  const subscriptions = await db
    .selectFrom("subscription")
    .selectAll()
    .execute()

  return c.json(subscriptions)
}

export const getSubscription: AppRouteHandler<GetSubscriptionRoute> = async (
  c,
) => {
  const { id } = c.req.param()

  const subscriptions = await db
    .selectFrom("subscription")
    .selectAll()
    .where("userId", "=", id)
    .execute()

  return c.json(subscriptions)
}

export const cancelSubscription: AppRouteHandler<
  CancelSubscriptionRoute
> = async (c) => {
  try {
    const { id: rawId } = c.req.param()
    const id = Number(rawId)

    const subscription = await db
      .selectFrom("subscription")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst()

    if (!subscription) {
      return c.json({ error: "Subscription not found" }, Status.NOT_FOUND)
    }

    await stripeClient.subscriptions.cancel(subscription.stripeSubscriptionId)

    await db
      .updateTable("subscription")
      .set({
        status: "canceled",
        canceledAt: new Date(),
      })
      .where("id", "=", id)
      .execute()

    return c.json({ message: "Subscription canceled successfully" }, Status.OK)
  } catch (err) {
    console.error("Erreur lors de l'annulation de l'abonnement:", err)

    return c.json(
      { error: (err as Error).message },
      Status.INTERNAL_SERVER_ERROR,
    )
  }
}
