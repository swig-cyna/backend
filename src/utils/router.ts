import type { ZodSchema } from "@/utils/types"
import { OpenAPIHono } from "@hono/zod-openapi"

export const createRouter = () => new OpenAPIHono({ strict: false })

export const jsonContent = <T extends ZodSchema>(
  schema: T,
  description: string,
) => ({
  content: {
    "application/json": {
      schema,
    },
  },
  description,
})
