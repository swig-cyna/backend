import { dialect } from "@/db"
import env from "@/env"
import { betterAuth } from "better-auth"

export const auth = betterAuth({
  trustedOrigins: [env.BETTER_AUTH_URL],
  database: {
    dialect,
    type: "postgres",
  },
  emailAndPassword: {
    enabled: true,
  },
})
