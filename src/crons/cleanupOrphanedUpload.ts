import { db } from "@/db"
import env from "@/env"
import bucket from "@/utils/s3"

const main = async () => {
  try {
    console.log("Starting orphaned carousel images cleanup job...")

    const slides = await db
      .selectFrom("carousel")
      .select("image")
      .where("image", "!=", "")
      .execute()

    const usedImages = new Set(slides.map((slide) => slide.image))
    console.log(
      `Found ${usedImages.size} images associated with carousel slides`,
    )

    const bucketObjects: string[] = []
    const objectsStream = bucket.client.listObjects(
      env.S3_NAME,
      "carousel/",
      true,
    )

    await new Promise<void>((resolve, reject) => {
      objectsStream.on("data", (obj) => {
        if (typeof obj.name === "string") {
          const fileName = obj.name.split("/").pop()

          if (fileName) {
            bucketObjects.push(fileName)
          }
        }
      })

      objectsStream.on("error", (err) => {
        reject(err)
      })

      objectsStream.on("end", () => {
        resolve()
      })
    })

    console.log(`Found ${bucketObjects.length} total images in carousel folder`)

    const orphanedImages = bucketObjects.filter(
      (fileName) => !usedImages.has(fileName),
    )
    console.log(`Found ${orphanedImages.length} orphaned images to delete`)

    let deletedCount = 0

    await Promise.all(
      orphanedImages.map(async (fileName) => {
        const result = await bucket.deleteFile({
          bucketName: env.S3_NAME,
          fileName: `carousel/${fileName}`,
        })

        if (result) {
          deletedCount += 1
          console.log(`Deleted orphaned image: carousel/${fileName}`)
        } else {
          console.error(`Failed to delete orphaned image: carousel/${fileName}`)
        }
      }),
    )

    console.log(`Cleanup complete. Deleted ${deletedCount} orphaned images`)

    return {
      totalInBucket: bucketObjects.length,
      usedInCarousel: usedImages.size,
      orphanedFound: orphanedImages.length,
      orphanedDeleted: deletedCount,
    }
  } catch (error) {
    console.error("Error in orphaned carousel images cleanup job:", error)
    throw error
  }
}

export default main
