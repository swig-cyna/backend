import { jsonContent } from "@/utils/router"
import { createRoute, z } from "@hono/zod-openapi"
import { Status } from "better-status-codes"
import { ProductSchema } from "./schemas"

const tags = ["Products"]

export const getProducts = createRoute({
  tags,
  path: "/products",
  method: "get",
  responses: {
    [Status.OK]: jsonContent(z.array(ProductSchema), "Get products"),
  },
})

export const getProductById = createRoute({
  tags,
  path: "/products/{id}",
  method: "get",
  params: z.object({ id: z.number() }),
  responses: {
    [Status.OK]: jsonContent(ProductSchema, "Get product"),
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

export const createProduct = createRoute({
  tags,
  path: "/products",
  method: "post",
  request: {
    body: jsonContent(ProductSchema, "Product data"),
  },
  responses: {
    [Status.CREATED]: jsonContent(ProductSchema, "Product created"),
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

export type GetProductsRoute = typeof getProducts
export type GetProductByIdRoute = typeof getProductById
export type CreateProductRoute = typeof createProduct
