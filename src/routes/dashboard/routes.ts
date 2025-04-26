import { adminMiddleware } from "@/utils/authMiddleware"
import { jsonContent } from "@/utils/router"
import { createRoute, z } from "@hono/zod-openapi"
import { Status, StatusMessage } from "better-status-codes"
import {
  ChartDataPointSchema,
  RecentOrderSchema,
  RecentTicketSchema,
  StatisticsSchema,
} from "./schemas"

const tags = ["Dashboard"]

export const getStatistics = createRoute({
  tags,
  path: "/dashboard/statistics",
  method: "get",
  middleware: [adminMiddleware],
  responses: {
    [Status.OK]: jsonContent(StatisticsSchema, "Dashboard statistics"),
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

export const getRecentOrders = createRoute({
  tags,
  path: "/dashboard/recent-orders",
  method: "get",
  middleware: [adminMiddleware],
  request: {
    query: z.object({
      limit: z.string().optional().openapi({
        example: "5",
        description: "Number of orders to return",
      }),
    }),
  },
  responses: {
    [Status.OK]: jsonContent(z.array(RecentOrderSchema), "Recent orders"),
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

export const getRecentTickets = createRoute({
  tags,
  path: "/dashboard/recent-tickets",
  method: "get",
  middleware: [adminMiddleware],
  request: {
    query: z.object({
      limit: z.string().optional().openapi({
        example: "5",
        description: "Number of tickets to return",
      }),
    }),
  },
  responses: {
    [Status.OK]: jsonContent(
      z.object({
        tickets: z.array(RecentTicketSchema),
        openCount: z.number(),
      }),
      "Recent tickets with open count",
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

export const getSalesOverview = createRoute({
  tags,
  path: "/dashboard/sales-overview",
  method: "get",
  middleware: [adminMiddleware],
  request: {
    query: z.object({
      period: z.enum(["month", "year"]).optional().openapi({
        example: "year",
        description: "Period to show data for (month or year)",
      }),
    }),
  },
  responses: {
    [Status.OK]: jsonContent(
      z.array(ChartDataPointSchema),
      "Sales overview chart data",
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

export type GetStatisticsRoute = typeof getStatistics
export type GetRecentOrdersRoute = typeof getRecentOrders
export type GetRecentTicketsRoute = typeof getRecentTickets
export type GetSalesOverviewRoute = typeof getSalesOverview
