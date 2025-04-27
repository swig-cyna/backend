import { adminMiddleware } from "@/utils/authMiddleware"
import { jsonContent } from "@/utils/router"
import { createRoute, z } from "@hono/zod-openapi"
import { Status } from "better-status-codes"
import { CreatePlantSchema, PlantSchema } from "./schemas"

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

export const createPlant = createRoute({
  tags,
  path: "/plants",
  method: "post",
  middleware: [adminMiddleware],
  request: {
    body: jsonContent(CreatePlantSchema, "plant data"),
  },
  responses: {
    [Status.CREATED]: jsonContent(PlantSchema, "plan created"),
    [Status.BAD_REQUEST]: jsonContent(
      z.object({ error: z.string().openapi({ example: "Invalid data" }) }),
      "Invalid data",
    ),
    [Status.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({ error: z.string().openapi({ example: "Stripe error" }) }),
      "Stripe error",
    ),
  },
})

export const updatePlant = createRoute({
  tags,
  path: "/plants/{id}",
  method: "put",
  middleware: [adminMiddleware],
  request: {
    params: z.object({ id: z.string() }),
    body: jsonContent(CreatePlantSchema, "Plant data"),
  },
  responses: {
    [Status.OK]: jsonContent(PlantSchema, "Plan updated"),
    [Status.NOT_FOUND]: jsonContent(
      z.object({
        error: z.string().openapi({
          example: "Product not found",
        }),
      }),
      "User not found",
    ),
    [Status.BAD_REQUEST]: jsonContent(
      z.object({ error: z.string().openapi({ example: "Invalid data" }) }),
      "Invalid data",
    ),
    [Status.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({ error: z.string().openapi({ example: "Stripe error" }) }),
      "Stripe error",
    ),
  },
})

export const deletePlant = createRoute({
  tags,
  path: "/plants/{id}",
  method: "delete",
  middleware: [adminMiddleware],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    [Status.OK]: jsonContent(PlantSchema, "delete plant"),
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
    [Status.INTERNAL_SERVER_ERROR]: jsonContent(
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
export type CreatePlantRoute = typeof createPlant
export type updatePlantRoute = typeof updatePlant
export type deletePlantRoute = typeof deletePlant
