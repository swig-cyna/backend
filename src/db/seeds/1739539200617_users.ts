import env from "@/env"
import { Kysely } from "kysely"

export async function seed(db: Kysely<any>): Promise<void> {
  const user = {
    name: "Jean Bon",
    email: "jean.bon@test.com",
    password: "123456789",
  }

  const isUserExist = await db
    .selectFrom("user")
    .select("email")
    .where("email", "=", user.email)
    .executeTakeFirst()

  if (isUserExist) {
    console.log("User already exists")

    return
  }

  const res = await fetch(
    `http://${env.DB_HOST}:${env.PORT}/api/auth/sign-up/email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    },
  )

  if (!res.ok) {
    throw new Error("User not created due to error.")
  }
}
