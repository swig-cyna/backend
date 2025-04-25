import { jsonContent } from "@/utils/router"
import { createRoute, z } from "@hono/zod-openapi"
import { Status } from "better-status-codes"
import { PlantSchema } from "./schemas"

const tags = ["Plants"]

export const getPlants = createRoute({
  tags,
  path: "/plants",
  method: "get",
  responses: {
    [Status.OK]: jsonContent(z.array(PlantSchema), "Get plants"),
  },
})

export const getPlant = createRoute({
  tags,
  path: "/plants/{id}",
  method: "get",
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    [Status.OK]: jsonContent(PlantSchema, "Get product"),
    [Status.NOT_FOUND]: jsonContent(
      z.object({
        error: z.string().openapi({
          example: "Product not found",
        }),
      }),
      "User not found",
    ),
    [Status.BAD_REQUEST]: jsonContent(
      z.object({
        error: z.string().openapi({
          example: "Invalid id",
        }),
      }),
      "Invalid id",
    ),
  },
})

export type GetPlantsRoute = typeof getPlants
export type GetPlantRoute = typeof getPlant
