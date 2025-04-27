import type { Kysely } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("subscription").dropColumn("quantity").execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("subscription")
    .addColumn("quantity", "integer")
    .execute()
}
