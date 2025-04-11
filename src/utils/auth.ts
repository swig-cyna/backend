import { dialect } from "@/db"
import {
  sendChangeEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "@/emails/emailService"
import env from "@/env"
import { stripeClient } from "@/utils/stripe"
import { stripe } from "@better-auth/stripe"
import { betterAuth } from "better-auth"
import { admin as adminPlugin, openAPI, twoFactor } from "better-auth/plugins"
import { ac, admin, superadmin, support, user as userRole } from "./permissions"

export const auth = betterAuth({
  appName: "Cyna",
  trustedOrigins: [env.FRONTEND_URL],
  database: {
    dialect,
    type: "postgres",
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
    },
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      partitioned: true,
    },
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
      defaultRole: "user",
      ac,
      roles: {
        userRole,
        support,
        admin,
        superadmin,
      },
      adminRoles: ["support", "admin", "superadmin"],
    }),
    twoFactor({
      skipVerificationOnEnable: false,
      totpOptions: {
        digits: 6,
        period: 30,
      },
    }),
    stripe({
      stripeClient,
      stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
      createCustomerOnSignUp: true,
    }),
  ],
})
