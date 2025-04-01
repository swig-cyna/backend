import { dialect } from "@/db"
import {
  sendChangeEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "@/emails/emailService"
import env from "@/env"
import { betterAuth } from "better-auth"
import { openAPI, admin as adminPlugin } from "better-auth/plugins"
import { Roles } from "./permissions"

export const auth = betterAuth({
  trustedOrigins: [env.FRONTEND_URL],
  database: {
    dialect,
    type: "postgres",
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 25,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail(user.email, user.name, url)
    },
    resetPasswordTokenExpiresIn: 3600,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail(user.email, user.name, url)
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, newEmail, url }) => {
        await sendChangeEmail(user, newEmail, url)
      },
    },
  },
  plugins: [
    openAPI(),
    adminPlugin({
      adminRoles: [Roles.ADMIN, Roles.SUPERADMIN],
    }),
  ],
})
