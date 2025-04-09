import { db } from "@/db"
import env from "@/env"
import bucket from "@/utils/s3"

const main = async () => {
  try {
    console.log("Starting orphaned images cleanup job...")
    const slides = await db
      .selectFrom("carousel")
      .select("image")
      .where("image", "!=", "")
      .execute()
    const productImages = await db
      .selectFrom("product_images")
      .select("file")
      .where("file", "!=", "")
      .execute()
    const images = [
      ...slides.map((slide) => slide.image),
      ...productImages.map((image) => image.file),
    ]
    const usedImages = new Set(images)
    console.log(
      `Found ${usedImages.size} images associated with carousel slides or products`,
    )

    const getObjectsFromFolder = async (
      folderPath: string,
    ): Promise<string[]> => {
      const objects: string[] = []
      const objectsStream = bucket.client.listObjects(
        env.S3_NAME,
        folderPath,
        true,
      )

      await new Promise<void>((resolve, reject) => {
        objectsStream.on("data", (obj) => {
          if (typeof obj.name === "string") {
            const fileName = obj.name.split("/").pop()

            if (fileName) {
              objects.push(fileName)
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

      return objects
    }

    const deleteOrphanedImagesFromFolder = async (
      folderPath: string,
      objects: string[],
      usedImagesSet: Set<string>,
    ): Promise<{ orphanedFound: number; orphanedDeleted: number }> => {
      const orphanedImages = objects.filter(
        (fileName) => !usedImagesSet.has(fileName),
      )

      console.log(
        `Found ${orphanedImages.length} orphaned images to delete in ${folderPath}`,
      )

      let deletedCount = 0
      await Promise.all(
        orphanedImages.map(async (fileName) => {
          const result = await bucket.deleteFile({
            bucketName: env.S3_NAME,
            fileName: `${folderPath}/${fileName}`,
          })

          if (result) {
            deletedCount += 1
            console.log(`Deleted orphaned image: ${folderPath}/${fileName}`)
          } else {
            console.error(
              `Failed to delete orphaned image: ${folderPath}/${fileName}`,
            )
          }
        }),
      )

      return {
        orphanedFound: orphanedImages.length,
        orphanedDeleted: deletedCount,
      }
    }

    // Carrousel
    const carouselObjects = await getObjectsFromFolder("carousel")
    console.log(
      `Found ${carouselObjects.length} total images in carousel folder`,
    )
    const carouselResult = await deleteOrphanedImagesFromFolder(
      "carousel",
      carouselObjects,
      usedImages,
    )

    // Products
    const productsObjects = await getObjectsFromFolder("products")
    console.log(
      `Found ${productsObjects.length} total images in products folder`,
    )
    const productsResult = await deleteOrphanedImagesFromFolder(
      "products",
      productsObjects,
      usedImages,
    )

    console.log(
      `Cleanup complete. Deleted ${carouselResult.orphanedDeleted + productsResult.orphanedDeleted} orphaned images in total`,
    )

    return {
      carousel: {
        totalInBucket: carouselObjects.length,
        orphanedFound: carouselResult.orphanedFound,
        orphanedDeleted: carouselResult.orphanedDeleted,
      },
      products: {
        totalInBucket: productsObjects.length,
        orphanedFound: productsResult.orphanedFound,
        orphanedDeleted: productsResult.orphanedDeleted,
      },
      usedImagesTotal: usedImages.size,
      totalOrphanedDeleted:
        carouselResult.orphanedDeleted + productsResult.orphanedDeleted,
    }
  } catch (error) {
    console.error("Error in orphaned images cleanup job:", error)
    throw error
  }
}

export default main
