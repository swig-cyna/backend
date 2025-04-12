import { adminMiddleware } from "@/utils/authMiddleware"
import responses from "@/utils/responses"
import { jsonContent } from "@/utils/router"
import { createRoute, z } from "@hono/zod-openapi"
import { Status, StatusMessage } from "better-status-codes"
import { CategoryEditSchema, CategorySchema } from "./schemas"

const tags = ["Categories"]

export const getCategories = createRoute({
  tags,
  path: "/categories",
  method: "get",
  request: {
    query: z.object({
      page: z.string().optional().openapi({
        example: "1",
        description: "Page number (starts from 1)",
      }),
      limit: z.string().optional().openapi({
        example: "10",
        description: "Number of items per page",
      }),
    }),
  },
  responses: {
    [Status.OK]: jsonContent(
      responses.paginationSchema(CategorySchema),
      "Get categories with pagination",
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
          example: StatusMessage.INTERNAL_SERVER_ERROR,
        }),
      }),
      StatusMessage.INTERNAL_SERVER_ERROR,
    ),
  },
})

export const getCategory = createRoute({
  tags,
  path: "/categories/{id}",
  method: "get",
  middleware: [adminMiddleware],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    [Status.OK]: jsonContent(CategorySchema, "Get category"),
    [Status.NOT_FOUND]: jsonContent(
      z.object({
        error: z.string().openapi({
          example: "Category not found",
        }),
      }),
      "Category not found",
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

// Rest of the routes remain the same
export const createCategory = createRoute({
  tags,
  path: "/categories",
  method: "post",
  middleware: [adminMiddleware],
  request: {
    body: jsonContent(CategoryEditSchema, "Category data"),
  },
  responses: {
    [Status.CREATED]: jsonContent(CategorySchema, "Category created"),
    [Status.BAD_REQUEST]: jsonContent(
      z.object({ error: z.string().openapi({ example: "Invalid data" }) }),
      "Invalid data",
    ),
    [Status.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({
        error: z
          .string()
          .openapi({ example: StatusMessage.INTERNAL_SERVER_ERROR }),
      }),
      StatusMessage.INTERNAL_SERVER_ERROR,
    ),
  },
})

export const updateCategory = createRoute({
  tags,
  path: "/categories/{id}",
  method: "put",
  middleware: [adminMiddleware],
  request: {
    params: z.object({ id: z.string() }),
    body: jsonContent(CategoryEditSchema, "Category data"),
  },
  responses: {
    [Status.OK]: jsonContent(CategorySchema, "Category updated"),
    [Status.NOT_FOUND]: jsonContent(
      z.object({
        error: z.string().openapi({
          example: "Category not found",
        }),
      }),
      "Category not found",
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

export const deleteCategory = createRoute({
  tags,
  path: "/categories/{id}",
  method: "delete",
  middleware: [adminMiddleware],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    [Status.OK]: jsonContent(CategorySchema, "Delete category"),
    [Status.BAD_REQUEST]: jsonContent(
      z.object({
        error: z.string().openapi({
          example: "Invalid id",
        }),
      }),
      "Invalid id",
    ),
    [Status.NOT_FOUND]: jsonContent(
      z.object({
        error: z.string().openapi({
          example: "Category not found",
        }),
      }),
      "Category not found",
    ),
    [Status.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({
        error: z.string().openapi({
          example: "Internal server error",
        }),
      }),
      "Internal server error",
    ),
  },
})

export type GetCategoriesRoute = typeof getCategories
export type GetCategoryRoute = typeof getCategory
export type CreateCategoryRoute = typeof createCategory
export type UpdateCategoryRoute = typeof updateCategory
export type DeleteCategoryRoute = typeof deleteCategory
