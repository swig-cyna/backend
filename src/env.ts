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
  DATABASE_URL: z.string(),
  DB_SEEDING: z
    .string()
    .transform((v) => v === "true")
    .default("false"),
  DB_MIGRATING: z
    .string()
    .transform((v) => v === "true")
    .default("false"),
  JWT_SECRET: z.string(),
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
