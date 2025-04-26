import { adminMiddleware } from "@/utils/authMiddleware"
import responses from "@/utils/responses"
import { jsonContent } from "@/utils/router"
import { createRoute, z } from "@hono/zod-openapi"
import { Status } from "better-status-codes"
import { CreateProductSchema, ProductSchema } from "./schemas"

const tags = ["Products"]

export const getProducts = createRoute({
  tags,
  path: "/products",
  method: "get",
  request: {
    query: z.object({
      page: z.string().min(1).default("1").optional(),
      limit: z.string().min(1).max(100).default("1").optional(),
      search: z.string().max(100).optional(),
      categories: z.string().optional(),
    }),
  },
  responses: {
    [Status.OK]: jsonContent(
      responses.paginationSchema(ProductSchema),
      "Get products",
    ),
    [Status.BAD_REQUEST]: jsonContent(
      z.object({
        error: z.string().openapi({
          example:
            "Invalid pagination parameters. Page must be >= 1 and limit must be between 1 and 100",
        }),
      }),
      "Invalid pagination parameters",
    ),
    [Status.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({
        error: z.string().openapi({
          example: "Failed to fetch products",
        }),
      }),
      "Failed to fetch products",
    ),
  },
})

export const getProductById = createRoute({
  tags,
  path: "/products/{id}",
  method: "get",
  request: {
    params: z.object({ id: z.string() }),
  },
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
  middleware: [adminMiddleware],
  request: {
    body: jsonContent(CreateProductSchema, "Product data"),
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

export const updateProduct = createRoute({
  tags,
  path: "/products/{id}",
  method: "put",
  middleware: [adminMiddleware],
  request: {
    params: z.object({ id: z.string() }),
    body: jsonContent(CreateProductSchema, "Product data"),
  },
  responses: {
    [Status.OK]: jsonContent(ProductSchema, "Product updated"),
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

export const addImageProduct = createRoute({
  tags,
  path: "/products/image",
  method: "post",
  middleware: [adminMiddleware],
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            required: ["image"],
            properties: {
              image: {
                type: "string",
                format: "binary",
              },
            },
          },
        },
      },
    },
  },
  responses: {
    [Status.OK]: jsonContent(
      z.object({
        imageId: z.string(),
      }),
      "Image uploaded",
    ),
    [Status.BAD_REQUEST]: jsonContent(
      z.object({ error: z.string().openapi({ example: "Invalid data" }) }),
      "Invalid data",
    ),
    [Status.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({
        error: z.string().openapi({ example: "Internal server error" }),
      }),
      "Internal server error",
    ),
  },
})

export const deleteProduct = createRoute({
  tags,
  path: "/products/{id}",
  method: "delete",
  middleware: [adminMiddleware],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    [Status.OK]: jsonContent(ProductSchema, "delete product"),
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

export type GetProductsRoute = typeof getProducts
export type GetProductByIdRoute = typeof getProductById
export type CreateProductRoute = typeof createProduct
export type UpdateProductRoute = typeof updateProduct
export type AddImageProductRoute = typeof addImageProduct
export type DeleteProductRoute = typeof deleteProduct
