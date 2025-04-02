import { db } from "@/db"
import env from "@/env"
import { saveFileInBucket } from "@/utils/s3"
import type { AppRouteHandler } from "@/utils/types"
import { Status } from "better-status-codes"
import {
  ChangeSlidePositionRoute,
  CreateSlideRoute,
  DeleteSlideRoute,
  GetCarouselRoute,
  GetSlideRoute,
  UpdateSlideRoute,
  UploadSlideImageRoute,
} from "./routes"

export const getCarousel: AppRouteHandler<GetCarouselRoute> = async (c) => {
  const slides = await db
    .selectFrom("carousel")
    .selectAll()
    .orderBy("position")
    .execute()

  return c.json(slides)
}

export const getCarouselSlide: AppRouteHandler<GetSlideRoute> = async (c) => {
  const { id: rawId } = c.req.param()

  if (!rawId) {
    return c.json({ error: "Missing id" }, Status.BAD_REQUEST)
  }

  const id = Number(rawId)

  const slide = await db
    .selectFrom("carousel")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst()

  if (!slide) {
    return c.json({ error: "Slide not found" }, Status.NOT_FOUND)
  }

  return c.json(slide, Status.OK)
}

export const createCarouselSlide: AppRouteHandler<CreateSlideRoute> = async (
  c,
) => {
  try {
    const { title, description, image, link, position } = c.req.valid("json")

    const [newSlide] = await db
      .insertInto("carousel")
      .values({
        title,
        description,
        image,
        link,
        position,
      })
      .returningAll()
      .execute()

    return c.json(newSlide, Status.CREATED)
  } catch (err) {
    console.error("Erreur lors de la création du slide:", err)

    return c.json(
      { error: (err as Error).message },
      Status.INTERNAL_SERVER_ERROR,
    )
  }
}

export const uploadSlideImage: AppRouteHandler<UploadSlideImageRoute> = async (
  c,
) => {
  try {
    const { id: rawId } = c.req.param()
    const id = Number(rawId)

    const slide = await db
      .selectFrom("carousel")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst()

    if (!slide) {
      return c.json({ error: "Slide not found" }, Status.NOT_FOUND)
    }

    const body = await c.req.parseBody()
    const file = body.image as File

    if (!file) {
      return c.json({ error: "Missing image" }, Status.BAD_REQUEST)
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    await saveFileInBucket({
      bucketName: env.S3_NAME,
      fileName: file.name,
      file: buffer,
    })

    return c.json(
      {
        message: "Image uploaded successfully",
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

export const updateCarouselSlide: AppRouteHandler<UpdateSlideRoute> = async (
  c,
) => {
  try {
    const { id: rawId } = c.req.param()
    const id = Number(rawId)
    const updates = c.req.valid("json")

    const slide = await db
      .selectFrom("carousel")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst()

    if (!slide) {
      return c.json({ error: "Slide not found" }, Status.NOT_FOUND)
    }

    const [updatedSlide] = await db
      .updateTable("carousel")
      .set({
        title: updates.title,
        description: updates.description,
        image: updates.image,
        link: updates.link,
        position: updates.position,
      })
      .where("id", "=", id)
      .returningAll()
      .execute()

    return c.json(updatedSlide, Status.OK)
  } catch (err) {
    console.error("Erreur lors de la modification du slide:", err)

    return c.json(
      { error: (err as Error).message },
      Status.INTERNAL_SERVER_ERROR,
    )
  }
}

export const changeCarouselSlidePosition: AppRouteHandler<
  ChangeSlidePositionRoute
> = async (c) => {
  try {
    const { id: rawId } = c.req.param()
    const id = Number(rawId)
    const { position } = c.req.valid("json")

    const slide = await db
      .selectFrom("carousel")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst()

    if (!slide) {
      return c.json({ error: "Slide not found" }, Status.NOT_FOUND)
    }

    const [updatedSlide] = await db
      .updateTable("carousel")
      .set({ position })
      .where("id", "=", id)
      .returningAll()
      .execute()

    return c.json(updatedSlide, Status.OK)
  } catch (err) {
    console.error("Erreur lors de la modification du slide:", err)

    return c.json(
      { error: (err as Error).message },
      Status.INTERNAL_SERVER_ERROR,
    )
  }
}

export const deleteCarouselSlide: AppRouteHandler<DeleteSlideRoute> = async (
  c,
) => {
  try {
    const { id: rawId } = c.req.param()
    const id = Number(rawId)

    const [deletedSlide] = await db
      .deleteFrom("carousel")
      .where("id", "=", id)
      .returningAll()
      .execute()

    if (!deletedSlide) {
      return c.json({ error: "Slide not found" }, Status.NOT_FOUND)
    }

    return c.json(deletedSlide, Status.OK)
  } catch (err) {
    console.error("Erreur lors de la suppression du slide:", err)

    return c.json(
      { error: (err as Error).message },
      Status.INTERNAL_SERVER_ERROR,
    )
  }
}
