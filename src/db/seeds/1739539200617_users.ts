import env from "@/env"
import { Kysely } from "kysely"

export async function seed(db: Kysely<any>): Promise<void> {
  const users = [
    {
      name: "Super Admin",
      email: "super.admin@test.com",
      password: "123456789",
      role: "superadmin",
    },
    {
      name: "Admin",
      email: "admin@test.com",
      password: "123456789",
      role: "admin",
    },
    {
      name: "Support",
      email: "support@test.com",
      password: "123456789",
      role: "support",
    },
    {
      name: "Utilisateur Standard",
      email: "user@test.com",
      password: "123456789",
      role: "user",
    },
  ]

  const promises = users.map(async (user) => {
    const existingUser = await db
      .selectFrom("user")
      .select("email")
      .where("email", "=", user.email)
      .executeTakeFirst()

    if (!existingUser) {
      const res = await fetch(
        `http://${env.DB_HOST}:${env.PORT}/api/auth/sign-up/email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            password: user.password,
          }),
        },
      )

      if (!res.ok) {
        throw new Error(
          `Échec de la création de ${user.email}: ${await res.text()}`,
        )
      }
    }

    await db
      .updateTable("user")
      .set({
        emailVerified: true,
        role: user.role,
      })
      .where("email", "=", user.email)
      .execute()
  })

  await Promise.all(promises)
}
