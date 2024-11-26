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

export default { unauthorized }
