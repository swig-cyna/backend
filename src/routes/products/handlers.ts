import { db } from "@/db"
import env from "@/env"
import bucket from "@/utils/s3"
import type { AppRouteHandler } from "@/utils/types"
import { Status } from "better-status-codes"
import { fileTypeFromBlob } from "file-type"
import { jsonArrayFrom } from "kysely/helpers/postgres"
import { nanoid } from "nanoid"
import Stripe from "stripe"
import { z } from "zod"
import type {
  AddImageProductRoute,
  CreateProductRoute,
  DeleteProductRoute,
  GetProductByIdRoute,
  GetProductsRoute,
  UpdateProductRoute,
} from "./routes"
import { ProductSchema } from "./schemas"

const stripe = new Stripe(env.STRIPE_SECRET_KEY)

export const getProducts: AppRouteHandler<GetProductsRoute> = async (c) => {
  try {
    const page = Number(c.req.query("page") || 1)
    const limit = Number(c.req.query("limit") || 10)
    const search = c.req.query("search") || ""

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

    let query = db.selectFrom("products")

    if (search) {
      query = query.where((eb) =>
        eb.or([
          eb("name", "like", eb.val(`%${search.toLowerCase()}%`)),
          eb("description", "like", eb.val(`%${search.toLowerCase()}%`)),
        ]),
      )
    }

    const rawProducts = await query
      .select((eb) => [
        "products.id",
        "products.name",
        "products.price",
        "products.description",
        "products.currency",
        "products.interval",
        jsonArrayFrom(
          eb
            .selectFrom("product_images")
            .select("file")
            .whereRef("product_images.product_id", "=", "products.id"),
        ).as("images"),
        jsonArrayFrom(
          eb
            .selectFrom("categories")
            .select("name")
            .whereRef("categories.id", "=", "products.category_id"),
        ).as("categories"),
      ])
      .limit(limit)
      .offset(offset)
      .execute()

    const products = rawProducts.map((product) => ({
      ...product,
      images: Array.isArray(product.images)
        ? product.images.map((img) => img.file)
        : [],
    }))

    let countQuery = db.selectFrom("products")

    if (search) {
      countQuery = countQuery.where((eb) =>
        eb.or([
          eb("name", "like", eb.val(`%${search}%`)),
          eb("description", "like", eb.val(`%${search}%`)),
        ]),
      )
    }

    const countResult = await countQuery
      .select(({ fn }) => [fn.count("id").as("total")])
      .executeTakeFirst()

    const totalProducts = Number(countResult?.total || 0)
    const totalPages = Math.ceil(totalProducts / limit)
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1
    const remainingPages = Math.max(0, totalPages - page)

    return c.json(
      {
        data: products,
        pagination: {
          currentPage: page,
          limit,
          totalItems: totalProducts,
          totalPages,
          remainingPages,
          hasNextPage,
          hasPreviousPage,
        },
      },
      Status.OK,
    )
  } catch (error) {
    console.error("Error fetching products:", error)

    return c.json(
      { error: "Failed to fetch products" },
      Status.INTERNAL_SERVER_ERROR,
    )
  }
}

export const getProduct: AppRouteHandler<GetProductByIdRoute> = async (c) => {
  const { id: rawId } = c.req.param()

  if (!rawId) {
    return c.json({ error: "Missing id" }, Status.BAD_REQUEST)
  }

  const id = Number(rawId)

  if (isNaN(id)) {
    return c.json({ error: "Invalid id" }, Status.BAD_REQUEST)
  }

  const rawProduct = await db
    .selectFrom("products")
    .select((eb) => [
      "products.id",
      "products.name",
      "products.price",
      "products.description",
      "products.currency",
      "products.interval",
      jsonArrayFrom(
        eb
          .selectFrom("product_images")
          .select("file")
          .whereRef("product_images.product_id", "=", "products.id"),
      ).as("images"),
      jsonArrayFrom(
        eb
          .selectFrom("categories")
          .select(["categories.id", "categories.name"])
          .whereRef("categories.id", "=", "products.category_id"),
      ).as("category"),
    ])
    .where("id", "=", id)
    .executeTakeFirst()

  if (!rawProduct) {
    return c.json({ error: "Product not found" }, Status.NOT_FOUND)
  }

  const product = {
    ...rawProduct,
    images: Array.isArray(rawProduct?.images)
      ? rawProduct.images.map((img) => img.file)
      : [],
  } as z.infer<typeof ProductSchema>

  if (!product) {
    return c.json({ error: "Product not found" }, Status.NOT_FOUND)
  }

  return c.json(product, Status.OK)
}

export const createProduct: AppRouteHandler<CreateProductRoute> = async (c) => {
  try {
    const {
      name,
      price,
      description,
      currency,
      interval,
      images,
      category_id,
    } = c.req.valid("json")

    const stripeProduct = await stripe.products.create({ name, description })

    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: Math.round(price * 100),
      currency,
      recurring: { interval },
    })

    const newProduct = await db
      .insertInto("products")
      .values({
        name,
        price,
        description,
        currency,
        interval,
        category_id,
        stripe_product_id: stripeProduct.id,
        stripe_price_id: stripePrice.id,
      })
      .returningAll()
      .executeTakeFirst()

    if (!newProduct) {
      return c.json(
        { error: "Failed to create product" },
        Status.INTERNAL_SERVER_ERROR,
      )
    }

    if (images && images.length > 0) {
      const imageValues = images.map((image: string) => ({
        product_id: newProduct.id,
        file: image,
      }))
      await db.insertInto("product_images").values(imageValues).execute()
    }

    return c.json(newProduct, Status.CREATED)
  } catch (err) {
    console.error("Erreur lors de la création du produit:", err)

    return c.json(
      { error: (err as Error).message },
      Status.INTERNAL_SERVER_ERROR,
    )
  }
}

export const updateProduct: AppRouteHandler<UpdateProductRoute> = async (c) => {
  try {
    const { id: rawId } = c.req.param()
    const id = Number(rawId)

    if (isNaN(id)) {
      return c.json({ error: "Invalid id" }, Status.BAD_REQUEST)
    }

    const updates = c.req.valid("json")

    const product = await db
      .selectFrom("products")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst()

    if (!product) {
      return c.json({ error: "Product not found" }, Status.NOT_FOUND)
    }

    const stripeProduct = await stripe.products.update(
      product.stripe_product_id,
      {
        name: updates.name,
        description: updates.description,
      },
    )

    await stripe.prices.update(product.stripe_price_id, { active: false })

    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: Math.round(updates.price * 100),
      currency: updates.currency,
      recurring: { interval: updates.interval },
    })

    const updatedProduct = await db
      .updateTable("products")
      .set({
        name: updates.name,
        price: updates.price,
        description: updates.description,
        currency: updates.currency,
        interval: updates.interval,
        category_id: updates.category_id,
        stripe_price_id: stripePrice.id,
      })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst()

    const images = await db
      .selectFrom("product_images")
      .select("file")
      .where("product_id", "=", id)
      .execute()

    const oldImages = images.map((image) => image.file)
    const deletedImages = oldImages.filter(
      (image) => !updates.images?.includes(image),
    )

    if (deletedImages.length > 0) {
      await db
        .deleteFrom("product_images")
        .where("product_id", "=", id)
        .where("file", "in", deletedImages)
        .execute()
    }

    const newImages = updates.images?.filter(
      (image) => !oldImages.includes(image),
    )

    if (newImages && newImages.length > 0) {
      const imageValues = newImages.map((image: string) => ({
        product_id: id,
        file: image,
      }))
      await db.insertInto("product_images").values(imageValues).execute()
    }

    return c.json(updatedProduct, Status.OK)
  } catch (err) {
    console.error("Erreur lors de la modification du produit:", err)

    return c.json(
      { error: (err as Error).message },
      Status.INTERNAL_SERVER_ERROR,
    )
  }
}

export const addImageProduct: AppRouteHandler<AddImageProductRoute> = async (
  c,
) => {
  try {
    const body = await c.req.parseBody()
    const file = body.image as File

    if (!file) {
      return c.json({ error: "Missing image" }, Status.BAD_REQUEST)
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const fileType = await fileTypeFromBlob(file)

    if (!fileType || !["image/jpeg", "image/png"].includes(fileType.mime)) {
      return c.json({ error: "Invalid file type" }, Status.BAD_REQUEST)
    }

    const extension = fileType.ext
    const fileName = `${nanoid()}.${extension}`

    await bucket.saveFile({
      bucketName: env.S3_NAME,
      fileName: `products/${fileName}`,
      file: buffer,
    })

    return c.json(
      {
        imageId: fileName,
      },
      Status.OK,
    )
  } catch (err) {
    console.error("Erreur lors de la modification du slide:", err)

    return c.json(
      { error: (err as Error).message },
      Status.INTERNAL_SERVER_ERROR,
    )
  }
}

export const deleteProduct: AppRouteHandler<DeleteProductRoute> = async (c) => {
  try {
    const { id: rawId } = c.req.param()
    const id = Number(rawId)

    if (!id) {
      return c.json({ error: "Missing id" }, Status.BAD_REQUEST)
    }

    if (isNaN(id)) {
      return c.json({ error: "Invalid id" }, Status.BAD_REQUEST)
    }

    const deletedProduct = await db
      .deleteFrom("products")
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst()

    if (!deletedProduct) {
      return c.json({ error: "Product not found" }, Status.NOT_FOUND)
    }

    await stripe.products.update(deletedProduct.stripe_product_id, {
      active: false,
    })

    return c.json(deletedProduct, Status.OK)
  } catch (err) {
    console.error("Erreur lors de la suppression du produit:", err)

    return c.json(
      { error: (err as Error).message },
      Status.INTERNAL_SERVER_ERROR,
    )
  }
}
