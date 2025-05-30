import { adminMiddleware } from "@/utils/authMiddleware"
import { jsonContent } from "@/utils/router"
import { createRoute, z } from "@hono/zod-openapi"
import { Status } from "better-status-codes"
import {
  CarouselSlideEditSchema,
  CarouselSlidePositionSchema,
  CarouselSlideSchema,
} from "./schemas"

const tags = ["Carousel"]

export const getCarousel = createRoute({
  tags,
  path: "/carousel",
  method: "get",
  responses: {
    [Status.OK]: jsonContent(z.array(CarouselSlideSchema), "Get products"),
  },
})

export const getSlide = createRoute({
  tags,
  path: "/carousel/{id}",
  method: "get",
  middleware: [adminMiddleware],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    [Status.OK]: jsonContent(CarouselSlideSchema, "Get slide of carousel"),
    [Status.NOT_FOUND]: jsonContent(
      z.object({
        error: z.string().openapi({
          example: "Slide not found",
        }),
      }),
      "Slide not found",
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

export const createSlide = createRoute({
  tags,
  path: "/carousel",
  method: "post",
  middleware: [adminMiddleware],
  request: {
    body: jsonContent(CarouselSlideEditSchema, "Carousel slide data"),
  },
  responses: {
    [Status.CREATED]: jsonContent(CarouselSlideSchema, "Slide created"),
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

export const uploadSlideImage = createRoute({
  tags,
  path: "/carousel/image",
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
    [Status.NOT_FOUND]: jsonContent(
      z.object({
        error: z.string().openapi({
          example: "Slide not found",
        }),
      }),
      "Slide not found",
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

export const updateSlide = createRoute({
  tags,
  path: "/carousel/{id}",
  method: "put",
  middleware: [adminMiddleware],
  request: {
    params: z.object({ id: z.string() }),
    body: jsonContent(CarouselSlideEditSchema, "Slide data"),
  },
  responses: {
    [Status.OK]: jsonContent(CarouselSlideSchema, "Slide updated"),
    [Status.NOT_FOUND]: jsonContent(
      z.object({
        error: z.string().openapi({
          example: "SLide not found",
        }),
      }),
      "User not found",
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

export const changeSlidePosition = createRoute({
  tags,
  path: "/carousel/{id}/position",
  method: "put",
  middleware: [adminMiddleware],
  request: {
    params: z.object({ id: z.string() }),
    body: jsonContent(CarouselSlidePositionSchema, "Slide position data"),
  },
  responses: {
    [Status.OK]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "Slide updated",
    ),
    [Status.NOT_FOUND]: jsonContent(
      z.object({
        error: z.string().openapi({
          example: "Slide not found",
        }),
      }),
      "Slide not found",
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

export const deleteSlide = createRoute({
  tags,
  path: "/carousel/{id}",
  method: "delete",
  middleware: [adminMiddleware],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    [Status.OK]: jsonContent(CarouselSlideSchema, "Delete carousel slide"),
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
          example: "Slide not found",
        }),
      }),
      "Slide not found",
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

export type GetCarouselRoute = typeof getCarousel
export type GetSlideRoute = typeof getSlide
export type CreateSlideRoute = typeof createSlide
export type UploadSlideImageRoute = typeof uploadSlideImage
export type UpdateSlideRoute = typeof updateSlide
export type ChangeSlidePositionRoute = typeof changeSlidePosition
export type DeleteSlideRoute = typeof deleteSlide
