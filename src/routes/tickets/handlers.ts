import { db } from "@/db"
import type { AppRouteHandler } from "@/utils/types"
import { Status } from "better-status-codes"

import { sendSupportTicketEmail } from "@/emails/emailService"
import { sql } from "kysely"
import {
  CreateTicketRoute,
  DeleteTicketRoute,
  GetTicketsRoute,
  UpdateTicketRoute,
} from "./routes"

export const getTicketsHandler: AppRouteHandler<GetTicketsRoute> = async (
  c,
) => {
  const user = c.get("user")

  if (!user) {
    return c.json({ error: "Utilisateur non authentifié" }, Status.UNAUTHORIZED)
  }

  const { context } = c.req.query()
  const role = user.role ?? "user"

  let ticketsQuery = db
    .selectFrom("ticket")
    .selectAll()
    .orderBy("created_at", "desc")

  if (context === "userspace") {
    ticketsQuery = ticketsQuery.where("user_id", "=", user.id)
  } else if (context === "backoffice") {
    const allowedRoles = ["support", "admin", "superadmin"]

    if (!allowedRoles.includes(role)) {
      return c.json({ error: "Accès refusé" }, Status.FORBIDDEN)
    }
  } else {
    return c.json(
      { error: "Paramètre 'context' requis (userspace/backoffice)" },
      Status.BAD_REQUEST,
    )
  }

  const tickets = await ticketsQuery.execute()

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

    await sendSupportTicketEmail(data.user_name, data.user_email, {
      id: newTicket.id,
      title: newTicket.title,
      theme: newTicket.theme,
      description: newTicket.description,
    })

    return c.json(formattedTicket, Status.CREATED)
  } catch (err) {
    return c.json({ error: (err as Error).message }, Status.BAD_REQUEST)
  }
}

export const deleteTicketHandler: AppRouteHandler<DeleteTicketRoute> = async (
  c,
) => {
  const { id: rawId } = c.req.param()

  if (!rawId) {
    return c.json({ error: "Missing id" }, Status.BAD_REQUEST)
  }

  const id = Number(rawId)

  try {
    const [deletedTicket] = await db
      .deleteFrom("ticket")
      .where("id", "=", id)
      .returningAll()
      .execute()

    return deletedTicket
      ? c.json(deletedTicket, Status.OK)
      : c.json({ error: "Ticket non trouvé" }, Status.NOT_FOUND)
  } catch (err) {
    return c.json({ error: (err as Error).message }, Status.BAD_REQUEST)
  }
}

export const updateTicketHandler: AppRouteHandler<UpdateTicketRoute> = async (
  c,
) => {
  const { id: rawId } = c.req.param()

  if (!rawId) {
    return c.json({ error: "Missing id" }, Status.BAD_REQUEST)
  }

  const id = Number(rawId)
  const data = c.req.valid("json")

  if (!data.status && !("assigned_to" in data)) {
    return c.json({ error: "Aucun champ à modifier" }, Status.BAD_REQUEST)
  }

  try {
    const [updatedTicket] = await db
      .updateTable("ticket")
      .set({
        ...(data.status && { status: data.status }),
        ...(data.assigned_to !== undefined && {
          assigned_to: data.assigned_to,
        }),
        updated_at: sql`CURRENT_TIMESTAMP`,
        ...(data.status === "closed" && { closed_at: sql`CURRENT_TIMESTAMP` }),
      })
      .where("id", "=", id)
      .returningAll()
      .execute()

    return updatedTicket
      ? c.json(updatedTicket, Status.OK)
      : c.json({ error: "Ticket non trouvé" }, Status.NOT_FOUND)
  } catch (err) {
    return c.json({ error: (err as Error).message }, Status.BAD_REQUEST)
  }
}
