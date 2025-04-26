import { type Kysely } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("order")
    .addColumn("shipping_address", "jsonb", (col) => col.notNull())
    .addColumn("billing_address", "jsonb", (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("order")
    .dropColumn("shipping_address")
    .dropColumn("billing_address")
    .execute()
}
