import { sessionMiddleware, supportMiddleware } from "@/utils/authMiddleware"
import { jsonContent } from "@/utils/router"
import { createRoute, z } from "@hono/zod-openapi"
import { Status } from "better-status-codes"

import {
  PublicTicketSchema,
  TicketCreateSchema,
  TicketSchema,
  TicketUpdateSchema,
} from "./schemas"

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
    [Status.OK]: jsonContent(z.array(PublicTicketSchema), "Liste des tickets"),
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

export const deleteTicket = createRoute({
  tags,
  path: "/tickets/{id}",
  method: "delete",
  middleware: [sessionMiddleware, supportMiddleware],
  params: z.object({ id: z.number() }),
  responses: {
    [Status.OK]: jsonContent(TicketSchema, "Ticket supprimé"),
    [Status.BAD_REQUEST]: jsonContent(
      z.object({ error: z.string() }),
      "Requête invalide",
    ),
    [Status.NOT_FOUND]: jsonContent(
      z.object({ error: z.string() }),
      "Ticket introuvable",
    ),
    [Status.UNAUTHORIZED]: jsonContent(
      z.object({ error: z.string() }),
      "Non autorisé",
    ),
    [Status.FORBIDDEN]: jsonContent(
      z.object({ error: z.string() }),
      "Permissions insuffisantes",
    ),
    [Status.CONFLICT]: jsonContent(
      z.object({ error: z.string() }),
      "Conflit de données",
    ),
  },
})

export const updateTicket = createRoute({
  tags,
  path: "/tickets/{id}",
  method: "patch",
  middleware: [sessionMiddleware, supportMiddleware],
  params: z.object({ id: z.number() }),
  request: {
    body: jsonContent(TicketUpdateSchema, "Champs à modifier"),
  },
  responses: {
    [Status.OK]: jsonContent(TicketSchema, "Ticket mis à jour"),
    [Status.BAD_REQUEST]: jsonContent(
      z.object({ error: z.string() }),
      "Requête invalide",
    ),
    [Status.NOT_FOUND]: jsonContent(
      z.object({ error: z.string() }),
      "Ticket introuvable",
    ),
    [Status.UNAUTHORIZED]: jsonContent(
      z.object({ error: z.string() }),
      "Non autorisé",
    ),
    [Status.FORBIDDEN]: jsonContent(
      z.object({ error: z.string() }),
      "Permissions insuffisantes",
    ),
  },
})

export type GetTicketsRoute = typeof getTickets
export type CreateTicketRoute = typeof createTicket
export type DeleteTicketRoute = typeof deleteTicket
export type UpdateTicketRoute = typeof updateTicket
