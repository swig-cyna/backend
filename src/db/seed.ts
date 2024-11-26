import { connection, db } from "@/db"
import env from "@/env"
import * as schema from "./schema"
import * as seeds from "./seeds"

if (!env.DB_SEEDING) {
  throw new Error('You must set DB_SEEDING to "true" when running seeds')
}

const deletePromises = [schema.users].map((table) => db.delete(table))

await Promise.all(deletePromises)

await seeds.users(db)

await connection.end()
