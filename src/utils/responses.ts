import { z } from "@hono/zod-openapi"

const unauthorized = {
  content: {
    "plain/text": {
      schema: z.string().openapi({
        example: "Unauthorized",
      }),
    },
  },
  description: "Unauthorized",
}

const paginationSchema = (schema: z.ZodSchema) =>
  z.object({
    data: z.array(schema),
    pagination: z.object({
      currentPage: z.number(),
      limit: z.number(),
      totalItems: z.number(),
      totalPages: z.number(),
      remainingPages: z.number(),
      hasNextPage: z.boolean(),
      hasPreviousPage: z.boolean(),
    }),
  })

export default { unauthorized, paginationSchema }
