import { sessionMiddleware, supportMiddleware } from "@/utils/authMiddleware"
import { jsonContent } from "@/utils/router"
import { createRoute, z } from "@hono/zod-openapi"
import { Status } from "better-status-codes"

const tags = ["List Users"]

export const listUsers = createRoute({
  tags,
  path: "/admin/users",
  method: "get",
  middleware: [sessionMiddleware, supportMiddleware],
  request: {
    query: z.object({
      role: z.string().optional().openapi({
        example: "support,admin",
        description: "Filtrer par rôle (ex: support, admin)",
      }),
      id: z.string().optional().openapi({
        example: "usr_abc123",
        description: "Filtrer par ID utilisateur",
      }),
      limit: z.number().optional().default(20).openapi({
        example: 50,
        description: "Nombre maximum de résultats",
      }),
      offset: z.number().optional().default(0).openapi({
        example: 100,
        description: "Offset pour la pagination",
      }),
    }),
  },
  responses: {
    [Status.OK]: jsonContent(
      z.object({
        users: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            role: z.string(),
          }),
        ),
      }),
      "Liste des utilisateurs",
    ),
    [Status.FORBIDDEN]: jsonContent(
      z.object({ error: z.string() }),
      "Permissions insuffisantes",
    ),
  },
})

export type ListUsersRoute = typeof listUsers
