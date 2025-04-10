import { db } from "@/db"
import env from "@/env"
import bucket from "@/utils/s3"
import type { AppRouteHandler } from "@/utils/types"
import { Status } from "better-status-codes"
import { fileTypeFromBlob } from "file-type"
import { nanoid } from "nanoid"

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

export const uploadSlideImage: AppRouteHandler<UploadSlideImageRoute> = async (
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
      fileName: `carousel/${fileName}`,
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

export const getCarouselSlide: AppRouteHandler<GetSlideRoute> = async (c) => {
  const { id: rawId } = c.req.param()

  if (!rawId) {
    return c.json({ error: "Missing id" }, Status.BAD_REQUEST)
  }

  const id = Number(rawId)

  if (isNaN(id)) {
    return c.json({ error: "Invalid id" }, Status.BAD_REQUEST)
  }

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
    const { title, description, image, link } = c.req.valid("json")

    const lastPosition = await db
      .selectFrom("carousel")
      .select("position")
      .orderBy("position", "desc")
      .limit(1)
      .executeTakeFirst()

    const position = lastPosition ? lastPosition.position + 1 : 0

    const [newSlide] = await db
      .insertInto("carousel")
      .values({
        title,
        description,
        image: image || "",
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

export const updateCarouselSlide: AppRouteHandler<UpdateSlideRoute> = async (
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
        ...(updates.image && { image: updates.image }),
        link: updates.link,
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

    if (!rawId) {
      return c.json({ error: "Missing id" }, Status.BAD_REQUEST)
    }

    const id = Number(rawId)

    if (isNaN(id)) {
      return c.json({ error: "Invalid id" }, Status.BAD_REQUEST)
    }

    const { position: newPosition } = c.req.valid("json")

    const slide = await db
      .selectFrom("carousel")
      .select(["id", "position"])
      .where("id", "=", id)
      .executeTakeFirst()

    if (!slide) {
      return c.json({ error: "Slide not found" }, Status.NOT_FOUND)
    }

    const oldPosition = slide.position

    await db.transaction().execute(async (trx) => {
      if (newPosition > oldPosition) {
        await trx
          .updateTable("carousel")
          .set((eb) => ({
            position: eb("position", "-", 1),
          }))
          .where("position", ">", oldPosition)
          .where("position", "<=", newPosition)
          .execute()
      } else if (newPosition < oldPosition) {
        await trx
          .updateTable("carousel")
          .set((eb) => ({
            position: eb("position", "+", 1),
          }))
          .where("position", ">=", newPosition)
          .where("position", "<", oldPosition)
          .execute()
      }

      await trx
        .updateTable("carousel")
        .set({ position: newPosition })
        .where("id", "=", id)
        .execute()
    })

    return c.json({ message: "Slide position updated" }, Status.OK)
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

    if (!rawId) {
      return c.json({ error: "Missing id" }, Status.BAD_REQUEST)
    }

    const id = Number(rawId)

    if (isNaN(id)) {
      return c.json({ error: "Invalid id" }, Status.BAD_REQUEST)
    }

    const [deletedSlide] = await db
      .deleteFrom("carousel")
      .where("id", "=", id)
      .returningAll()
      .execute()

    if (!deletedSlide) {
      return c.json({ error: "Slide not found" }, Status.NOT_FOUND)
    }

    await bucket.deleteFile({
      bucketName: env.S3_NAME,
      fileName: `carousel/${deletedSlide.image}`,
    })

    return c.json(deletedSlide, Status.OK)
  } catch (err) {
    console.error("Erreur lors de la suppression du slide:", err)

    return c.json(
      { error: (err as Error).message },
      Status.INTERNAL_SERVER_ERROR,
    )
  }
}
