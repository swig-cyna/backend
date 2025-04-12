import { sessionMiddleware } from "@/utils/authMiddleware"
import { jsonContent } from "@/utils/router"
import { createRoute, z } from "@hono/zod-openapi"
import { Status } from "better-status-codes"

import { TicketCreateSchema, TicketSchema } from "./schemas"

const tags = ["Tickets"]

export const getTickets = createRoute({
  tags,
  path: "/tickets",
  method: "get",
  middleware: [sessionMiddleware],
  request: {
    query: z.object({
      context: z.enum(["userspace", "backoffice"]).optional(),
    }),
  },
  responses: {
    [Status.OK]: jsonContent(z.array(TicketSchema), "Liste des tickets"),
    [Status.UNAUTHORIZED]: jsonContent(
      z.object({ error: z.string() }),
      "Non autorisé",
    ),
    [Status.FORBIDDEN]: jsonContent(
      z.object({ error: z.string() }),
      "Accès refusé",
    ),
    [Status.BAD_REQUEST]: jsonContent(
      z.object({ error: z.string() }),
      "Paramètre manquant",
    ),
  },
})

export const createTicket = createRoute({
  tags,
  path: "/tickets",
  method: "post",
  middleware: [sessionMiddleware],
  request: {
    body: jsonContent(TicketCreateSchema, "Données du ticket"),
  },
  responses: {
    [Status.CREATED]: jsonContent(TicketSchema, "Ticket créé"),
    [Status.BAD_REQUEST]: jsonContent(
      z.object({ error: z.string() }),
      "Données invalides",
    ),
  },
})

export type GetTicketsRoute = typeof getTickets
export type CreateTicketRoute = typeof createTicket
