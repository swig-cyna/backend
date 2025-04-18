import { config } from "dotenv"
import { expand } from "dotenv-expand"
import "dotenv/config"
import { z } from "zod"

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.string().transform(Number),
  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DB_PORT: z.string().transform(Number),
  DB_SEEDING: z
    .string()
    .transform((v) => v === "true")
    .default("false"),
  DB_MIGRATING: z
    .string()
    .transform((v) => v === "true")
    .default("false"),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),
  RESEND_API_KEY: z.string(),
  FRONTEND_URL: z.string(),
  SUBDOMAIN_CORS: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),

  S3_ENDPOINT: z.string(),
  S3_PORT: z.string().transform(Number),
  S3_NAME: z.string(),
  S3_ACCESS_KEY: z.string(),
  S3_SECRET_KEY: z.string(),
  S3_USE_SSL: z.string().transform((v) => v === "true"),
})

expand(config())

export type envType = z.infer<typeof EnvSchema>

const { data: env, error } = EnvSchema.safeParse(process.env)

if (error) {
  console.error("❌ Invalid environment variables:")
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2))
  process.exit(1)
}

export default env!
