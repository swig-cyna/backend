import { db } from "@/db"
import type { AppRouteHandler } from "@/utils/types"
import { Status } from "better-status-codes"

import { sql } from "kysely"
import { CreateTicketRoute, GetTicketsRoute } from "./routes"

export const getTicketsHandler: AppRouteHandler<GetTicketsRoute> = async (
  c,
) => {
  const tickets = await db
    .selectFrom("ticket")
    .selectAll()
    .orderBy("created_at", "desc")
    .execute()

  return c.json(tickets, Status.OK)
}

export const createTicketHandler: AppRouteHandler<CreateTicketRoute> = async (
  c,
) => {
  try {
    const user = c.get("user")

    const data = c.req.valid("json")

    const [newTicket] = await db
      .insertInto("ticket")
      .values({
        ...data,
        user_id: user?.id || "0",
        created_at: sql`CURRENT_TIMESTAMP`,
        updated_at: sql`CURRENT_TIMESTAMP`,
      })
      .returningAll()
      .execute()

    const formattedTicket = {
      ...newTicket,
      created_at: new Date(newTicket.created_at).toISOString(),
      updated_at: new Date(newTicket.updated_at).toISOString(),
      closed_at: newTicket.closed_at
        ? new Date(newTicket.closed_at).toISOString()
        : null,
    }

    return c.json(formattedTicket, Status.CREATED)
  } catch (err) {
    return c.json({ error: (err as Error).message }, Status.BAD_REQUEST)
  }
}
