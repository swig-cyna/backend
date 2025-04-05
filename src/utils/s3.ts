/* eslint-disable no-unused-vars */
import env from "@/env"
import * as Minio from "minio"
import stream from "stream"

export const client = new Minio.Client({
  endPoint: env.S3_ENDPOINT,
  port: env.S3_PORT ? Number(env.S3_PORT) : undefined,
  accessKey: env.S3_ACCESS_KEY,
  secretKey: env.S3_SECRET_KEY,
  useSSL: env.S3_USE_SSL,
})

export const checkBucketExists = async (bucketName: string) => {
  const bucketExists = await client.bucketExists(bucketName)

  if (!bucketExists) {
    throw new Error("Bucket does not exist")
  }
}

const saveFile = async ({
  bucketName,
  fileName,
  file,
}: {
  bucketName: string
  fileName: string
  file: Buffer | stream.Readable
}) => {
  await checkBucketExists(bucketName)

  const fileExists = await checkIsExist({
    bucketName,
    fileName,
  })

  if (fileExists) {
    throw new Error("File already exists")
  }

  await client.putObject(bucketName, fileName, file)
}

const checkIsExist = async ({
  bucketName,
  fileName,
}: {
  bucketName: string
  fileName: string
}) => {
  try {
    await client.statObject(bucketName, fileName)
  } catch (error) {
    return false
  }

  return true
}

const getFile = async ({
  bucketName,
  fileName,
}: {
  bucketName: string
  fileName: string
}) => {
  try {
    await client.statObject(bucketName, fileName)
  } catch (error) {
    console.error(error)

    return null
  }

  return await client.getObject(bucketName, fileName)
}

const deleteFile = async ({
  bucketName,
  fileName,
}: {
  bucketName: string
  fileName: string
}) => {
  try {
    await client.removeObject(bucketName, fileName)
  } catch (error) {
    console.error(error)

    return false
  }

  return true
}

export default {
  client,
  checkBucketExists,
  saveFile,
  checkIsExist,
  getFile,
  deleteFile,
}
