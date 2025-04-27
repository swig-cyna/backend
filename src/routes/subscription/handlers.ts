import { db } from "@/db"
import { stripeClient } from "@/utils/stripe"
import type { AppRouteHandler } from "@/utils/types"
import { Status } from "better-status-codes"
import type {
  CancelSubscriptionRoute,
  CreateSubscriptionRoute,
  GetSubscriptionRoute,
  GetSubscriptionsRoute,
} from "./routes"

export const createSubscription: AppRouteHandler<
  CreateSubscriptionRoute
> = async (c) => {
  try {
    const { userId, plantId, paymentMethodId, interval } = c.req.valid("json")

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

    const plant = await db
      .selectFrom("plants")
      .selectAll()
      .where("id", "=", plantId)
      .executeTakeFirst()

    if (!plant) {
      return c.json({ error: "Product not found" }, Status.NOT_FOUND)
    }

    if (interval === "month") {
      const subscription = await stripeClient.subscriptions.create({
        customer: user.stripeCustomerId,
        items: [
          {
            price: plant.stripe_price_id,
          },
        ],
        default_payment_method: paymentMethodId,
      })

      const [newSubscription] = await db
        .insertInto("subscription")
        .values({
          userId,
          plantId,
          stripeCustomerId: user.stripeCustomerId,
          stripeSubscriptionId: subscription.id,
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        })
        .returningAll()
        .execute()

      return c.json(newSubscription, Status.CREATED)
    }

    const subscription = await stripeClient.subscriptions.create({
      customer: user.stripeCustomerId,
      items: [
        {
          price: plant.stripe_price_id,
        },
      ],
      cancel_at: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60,
      default_payment_method: paymentMethodId,
    })

    const [newSubscription] = await db
      .insertInto("subscription")
      .values({
        userId,
        plantId,
        stripeCustomerId: user.stripeCustomerId,
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
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

  const subscriptionsWithPlants = await db
    .selectFrom("subscription")
    .leftJoin("plants", "subscription.plantId", "plants.id")
    .select([
      "subscription.id",
      "subscription.userId",
      "subscription.plantId",
      "subscription.stripeCustomerId",
      "subscription.stripeSubscriptionId",
      "subscription.status",
      "subscription.currentPeriodEnd",
      "subscription.createdAt",
      "subscription.updatedAt",
      "subscription.canceledAt",
      "plants.name as plant_name",
      "plants.price as plant_price",
      "plants.discount as plant_discount",
      "plants.description as plant_description",
      "plants.interval as plant_interval",
    ])
    .where("subscription.userId", "=", id)
    .where("subscription.status", "=", "active")
    .execute()

  return c.json(subscriptionsWithPlants)
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
