import { createRouter, jsonContent } from "@/utils/router"
import { createRoute, z } from "@hono/zod-openapi"

const router = createRouter().openapi(
  createRoute({
    method: "get",
    path: "/",
    responses: {
      200: jsonContent(
        z.object({
          message: z.string().openapi({
            example: "API Index",
          }),
        }),
        "API Index"
      ),
    },
  }),
  (c) => c.json({ message: "API Index" })
)

export default router
