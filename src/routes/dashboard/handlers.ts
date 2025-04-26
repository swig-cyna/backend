import { db } from "@/db"
import type { AppRouteHandler } from "@/utils/types"
import { Status } from "better-status-codes"
import { sql } from "kysely"
import {
  GetRecentOrdersRoute,
  GetRecentTicketsRoute,
  GetSalesOverviewRoute,
  GetStatisticsRoute,
} from "./routes"

export const getStatistics: AppRouteHandler<GetStatisticsRoute> = async (c) => {
  try {
    const userCount = await db
      .selectFrom("user")
      .select(({ fn }) => [fn.count("id").as("count")])
      .executeTakeFirst()

    const currentMonthStart = new Date()
    currentMonthStart.setDate(1)
    currentMonthStart.setHours(0, 0, 0, 0)

    const lastMonthStart = new Date(currentMonthStart)
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1)

    const twoMonthsAgoStart = new Date(lastMonthStart)
    twoMonthsAgoStart.setMonth(twoMonthsAgoStart.getMonth() - 1)

    const currentMonthUsers = await db
      .selectFrom("user")
      .select(({ fn }) => [fn.count("id").as("count")])
      .where("createdAt", ">=", currentMonthStart)
      .executeTakeFirst()

    const lastMonthUsers = await db
      .selectFrom("user")
      .select(({ fn }) => [fn.count("id").as("count")])
      .where("createdAt", ">=", lastMonthStart)
      .where("createdAt", "<", currentMonthStart)
      .executeTakeFirst()

    const userGrowth =
      lastMonthUsers && Number(lastMonthUsers.count) > 0
        ? ((Number(currentMonthUsers?.count || 0) -
            Number(lastMonthUsers.count)) /
            Number(lastMonthUsers.count)) *
          100
        : 0

    const productCount = await db
      .selectFrom("products")
      .select(({ fn }) => [fn.count("id").as("count")])
      .executeTakeFirst()

    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - 7)
    weekStart.setHours(0, 0, 0, 0)

    const newProductsCount = await db
      .selectFrom("products")
      .select(({ fn }) => [fn.count("id").as("count")])
      .where("created_at", ">=", weekStart)
      .executeTakeFirst()

    const orderCount = await db
      .selectFrom("order")
      .select(({ fn }) => [fn.count("id").as("count")])
      .executeTakeFirst()

    const weekAgoStart = new Date()
    weekAgoStart.setDate(weekAgoStart.getDate() - 7)
    weekAgoStart.setHours(0, 0, 0, 0)

    const twoWeeksAgoStart = new Date(weekAgoStart)
    twoWeeksAgoStart.setDate(twoWeeksAgoStart.getDate() - 7)

    const currentWeekOrders = await db
      .selectFrom("order")
      .select(({ fn }) => [fn.count("id").as("count")])
      .where("createdAt", ">=", weekAgoStart)
      .executeTakeFirst()

    const lastWeekOrders = await db
      .selectFrom("order")
      .select(({ fn }) => [fn.count("id").as("count")])
      .where("createdAt", ">=", twoWeeksAgoStart)
      .where("createdAt", "<", weekAgoStart)
      .executeTakeFirst()

    const orderGrowth =
      lastWeekOrders && Number(lastWeekOrders.count) > 0
        ? ((Number(currentWeekOrders?.count || 0) -
            Number(lastWeekOrders.count)) /
            Number(lastWeekOrders.count)) *
          100
        : 0

    const currentMonthRevenue = await db
      .selectFrom("order")
      .select(({ fn }) => [fn.sum("amount").as("total")])
      .where("createdAt", ">=", currentMonthStart)
      .executeTakeFirst()

    const lastMonthRevenue = await db
      .selectFrom("order")
      .select(({ fn }) => [fn.sum("amount").as("total")])
      .where("createdAt", ">=", lastMonthStart)
      .where("createdAt", "<", currentMonthStart)
      .executeTakeFirst()

    const totalRevenue = await db
      .selectFrom("order")
      .select(({ fn }) => [fn.sum("amount").as("total")])
      .executeTakeFirst()

    const revenueGrowth =
      lastMonthRevenue && Number(lastMonthRevenue.total) > 0
        ? ((Number(currentMonthRevenue?.total || 0) -
            Number(lastMonthRevenue.total)) /
            Number(lastMonthRevenue.total)) *
          100
        : 0

    return c.json(
      {
        users: {
          count: Number(userCount?.count || 0),
          growth: Math.round(userGrowth * 10) / 10,
        },
        products: {
          count: Number(productCount?.count || 0),
          newCount: Number(newProductsCount?.count || 0),
        },
        orders: {
          count: Number(orderCount?.count || 0),
          growth: Math.round(orderGrowth * 10) / 10,
        },
        revenue: {
          amount: Number(totalRevenue?.total || 0),
          growth: Math.round(revenueGrowth * 10) / 10,
          currency: "€",
        },
      },
      Status.OK,
    )
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error)

    return c.json(
      { error: "Failed to fetch dashboard statistics" },
      Status.INTERNAL_SERVER_ERROR,
    )
  }
}

export const getRecentOrders: AppRouteHandler<GetRecentOrdersRoute> = async (
  c,
) => {
  try {
    const limit = Number(c.req.query("limit") || 5)

    const orders = await db
      .selectFrom("order")
      .innerJoin("user", "user.id", "order.userId")
      .select([
        "order.id",
        "user.name as userName",
        "user.email",
        "order.amount",
        "order.status",
        "user.image as userImage",
        "order.createdAt as date",
      ])
      .orderBy("order.createdAt", "desc")
      .limit(limit)
      .execute()

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      userName: order.userName,
      email: order.email,
      amount: Number(order.amount),
      status: order.status,
      userImage: order.userImage,
      date: new Date(order.date).toISOString(),
    }))

    return c.json(formattedOrders, Status.OK)
  } catch (error) {
    console.error("Error fetching recent orders:", error)

    return c.json(
      { error: "Failed to fetch recent orders" },
      Status.INTERNAL_SERVER_ERROR,
    )
  }
}

export const getRecentTickets: AppRouteHandler<GetRecentTicketsRoute> = async (
  c,
) => {
  try {
    const limit = Number(c.req.query("limit") || 5)

    const tickets = await db
      .selectFrom("ticket")
      .innerJoin("user", "user.id", "ticket.user_id")
      .select([
        "ticket.id",
        "ticket.title",
        "ticket.user_name as userName",
        "ticket.status",
        "user.image as userImage",
        "ticket.created_at as date",
      ])
      .orderBy("ticket.created_at", "desc")
      .limit(limit)
      .execute()

    const openTicketsCount = await db
      .selectFrom("ticket")
      .select(({ fn }) => [fn.count("id").as("count")])
      .where("status", "=", "open")
      .executeTakeFirst()

    const formattedTickets = tickets.map((ticket) => ({
      id: ticket.id,
      title: ticket.title,
      userName: ticket.userName,
      status: ticket.status,
      userImage: ticket.userImage,
      date: new Date(ticket.date).toISOString(),
    }))

    return c.json(
      {
        tickets: formattedTickets,
        openCount: Number(openTicketsCount?.count || 0),
      },
      Status.OK,
    )
  } catch (error) {
    console.error("Error fetching recent tickets:", error)

    return c.json(
      { error: "Failed to fetch recent tickets" },
      Status.INTERNAL_SERVER_ERROR,
    )
  }
}

export const getSalesOverview: AppRouteHandler<GetSalesOverviewRoute> = async (
  c,
) => {
  try {
    const period = c.req.query("period") || "year"
    const currentDate = new Date()
    let labels: string[] = []

    if (period === "month") {
      labels = Array.from({ length: 30 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)

        return `${date.getDate().toString().padStart(2, "0")}-${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}`
      }).reverse()
    } else {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ]
      labels = monthNames
    }

    const chartData = labels.map((name) => ({ name, total: 0 }))
    let salesData = null

    if (period === "month") {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      salesData = await db
        .selectFrom("order")
        .select([
          sql`TO_CHAR("createdAt", 'DD-MM')`.as("period"),
          sql`SUM(amount)`.as("total"),
        ])
        .where("createdAt", ">=", thirtyDaysAgo)
        .groupBy(sql`period`)
        .execute()
    } else {
      const startOfYear = new Date(currentDate.getFullYear(), 0, 1)

      salesData = await db
        .selectFrom("order")
        .select([
          sql`EXTRACT(MONTH FROM "createdAt")`.as("month_number"),
          sql`SUM(amount)`.as("total"),
        ])
        .where("createdAt", ">=", startOfYear)
        .groupBy(sql`month_number`)
        .execute()
    }

    if (period === "month") {
      salesData.forEach((data) => {
        if ("period" in data) {
          const index = chartData.findIndex((item) => item.name === data.period)

          if (index !== -1) {
            chartData[index].total = Number(data.total)
          }
        }
      })
    } else {
      salesData.forEach((data) => {
        if ("month_number" in data) {
          const monthIndex = parseInt(String(data.month_number), 10) - 1

          if (monthIndex >= 0 && monthIndex < 12) {
            chartData[monthIndex].total = Number(data.total)
          }
        }
      })
    }

    return c.json(chartData, Status.OK)
  } catch (error) {
    console.error("Error fetching sales overview:", error)

    return c.json(
      { error: "Failed to fetch sales overview" },
      Status.INTERNAL_SERVER_ERROR,
    )
  }
}
