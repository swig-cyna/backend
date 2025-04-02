/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import env from "@/env"
import * as Minio from "minio"
import stream from "stream"

export const s3Client = new Minio.Client({
  endPoint: env.S3_ENDPOINT,
  port: env.S3_PORT ? Number(env.S3_PORT) : undefined,
  accessKey: env.S3_ACCESS_KEY,
  secretKey: env.S3_SECRET_KEY,
  useSSL: env.S3_USE_SSL,
})

export const checkBucketExists = async (bucketName: string) => {
  const bucketExists = await s3Client.bucketExists(bucketName)

  if (!bucketExists) {
    throw new Error("Bucket does not exist")
  }
}

export const saveFileInBucket = async ({
  bucketName,
  fileName,
  file,
}: {
  bucketName: string
  fileName: string
  file: Buffer | stream.Readable
}) => {
  await checkBucketExists(bucketName)

  const fileExists = await checkFileExistsInBucket({
    bucketName,
    fileName,
  })

  if (fileExists) {
    throw new Error("File already exists")
  }

  await s3Client.putObject(bucketName, fileName, file)
}

export const checkFileExistsInBucket = async ({
  bucketName,
  fileName,
}: {
  bucketName: string
  fileName: string
}) => {
  try {
    await s3Client.statObject(bucketName, fileName)
  } catch (error) {
    return false
  }

  return true
}

export const getFileFromBucket = async ({
  bucketName,
  fileName,
}: {
  bucketName: string
  fileName: string
}) => {
  try {
    await s3Client.statObject(bucketName, fileName)
  } catch (error) {
    console.error(error)

    return null
  }

  return await s3Client.getObject(bucketName, fileName)
}

export const deleteFileFromBucket = async ({
  bucketName,
  fileName,
}: {
  bucketName: string
  fileName: string
}) => {
  try {
    await s3Client.removeObject(bucketName, fileName)
  } catch (error) {
    console.error(error)

    return false
  }

  return true
}
