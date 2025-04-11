import { db } from "@/db"
import type { AppRouteHandler } from "@/utils/types"
import { Status } from "better-status-codes"
import {
  CreateCategoryRoute,
  DeleteCategoryRoute,
  GetCategoriesRoute,
  GetCategoryRoute,
  UpdateCategoryRoute,
} from "./routes"

export const getCategories: AppRouteHandler<GetCategoriesRoute> = async (c) => {
  try {
    const page = Number(c.req.query("page") || 1)
    const limit = Number(c.req.query("limit") || 10)

    if (page < 1 || limit < 1 || limit > 100) {
      return c.json(
        {
          error:
            "Invalid pagination parameters. Page must be >= 1 and limit must be between 1 and 100",
        },
        Status.BAD_REQUEST,
      )
    }

    const offset = (page - 1) * limit

    const query = db.selectFrom("categories")

    const rawCategories = await query
      .selectAll("categories")
      .leftJoin("products", "categories.id", "products.category_id")
      .groupBy("categories.id")
      .limit(limit)
      .offset(offset)
      .select(({ fn }) => [fn.count("products.id").as("product_count")])
      .execute()

    const categories = rawCategories.map((category) => ({
      ...category,
      count: Number(category.product_count || 0),
    }))

    const countQuery = db.selectFrom("categories")

    const countResult = await countQuery
      .select(({ fn }) => [fn.count("id").as("total")])
      .executeTakeFirst()

    const totalCategories = Number(countResult?.total || 0)
    const totalPages = Math.ceil(totalCategories / limit)
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1
    const remainingPages = Math.max(0, totalPages - page)

    return c.json(
      {
        data: categories,
        pagination: {
          currentPage: page,
          limit,
          totalItems: totalCategories,
          totalPages,
          remainingPages,
          hasNextPage,
          hasPreviousPage,
        },
      },
      Status.OK,
    )
  } catch (error) {
    console.error("Error fetching categories:", error)

    return c.json(
      { error: "Failed to fetch categories" },
      Status.INTERNAL_SERVER_ERROR,
    )
  }
}

export const getCategory: AppRouteHandler<GetCategoryRoute> = async (c) => {
  const { id: rawId } = c.req.param()

  if (!rawId) {
    return c.json({ error: "Missing id" }, Status.BAD_REQUEST)
  }

  const id = Number(rawId)

  if (isNaN(id)) {
    return c.json({ error: "Invalid id" }, Status.BAD_REQUEST)
  }

  const category = await db
    .selectFrom("categories")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst()

  if (!category) {
    return c.json({ error: "Category not found" }, Status.NOT_FOUND)
  }

  return c.json(category, Status.OK)
}

export const createCategory: AppRouteHandler<CreateCategoryRoute> = async (
  c,
) => {
  try {
    const { name, color } = c.req.valid("json")
    const newCategory = await db
      .insertInto("categories")
      .values({
        name,
        color,
      })
      .returningAll()
      .executeTakeFirst()

    return c.json(newCategory, Status.CREATED)
  } catch (err) {
    console.error("Erreur lors de la création de la catégorie:", err)

    return c.json(
      { error: (err as Error).message },
      Status.INTERNAL_SERVER_ERROR,
    )
  }
}

export const updateCategory: AppRouteHandler<UpdateCategoryRoute> = async (
  c,
) => {
  try {
    const { id: rawId } = c.req.param()

    if (!rawId) {
      return c.json({ error: "Missing id" }, Status.BAD_REQUEST)
    }

    const id = Number(rawId)

    if (isNaN(id)) {
      return c.json({ error: "Invalid id" }, Status.BAD_REQUEST)
    }

    const updates = c.req.valid("json")

    const category = await db
      .selectFrom("categories")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst()

    if (!category) {
      return c.json({ error: "Category not found" }, Status.NOT_FOUND)
    }

    const updatedCategory = await db
      .updateTable("categories")
      .set({
        name: updates.name,
        color: updates.color,
      })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst()

    return c.json(updatedCategory, Status.OK)
  } catch (err) {
    console.error("Erreur lors de la modification de la catégorie:", err)

    return c.json(
      { error: (err as Error).message },
      Status.INTERNAL_SERVER_ERROR,
    )
  }
}

export const deleteCategory: AppRouteHandler<DeleteCategoryRoute> = async (
  c,
) => {
  try {
    const { id: rawId } = c.req.param()

    if (!rawId) {
      return c.json({ error: "Missing id" }, Status.BAD_REQUEST)
    }

    const id = Number(rawId)

    if (isNaN(id)) {
      return c.json({ error: "Invalid id" }, Status.BAD_REQUEST)
    }

    const deletedCategory = await db
      .deleteFrom("categories")
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst()

    if (!deletedCategory) {
      return c.json({ error: "Category not found" }, Status.NOT_FOUND)
    }

    return c.json(deletedCategory, Status.OK)
  } catch (err) {
    console.error("Erreur lors de la suppression de la catégorie:", err)

    return c.json(
      { error: (err as Error).message },
      Status.INTERNAL_SERVER_ERROR,
    )
  }
}
