import type { Kysely } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("products")
    .renameColumn("price", "price_month")
    .renameColumn("stripe_price_id", "stripe_price_month_id")
    .addColumn("price_year", "integer", (col) => col.notNull())
    .addColumn("stripe_price_year_id", "varchar(255)", (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("products")
    .dropColumn("price_month")
    .dropColumn("price_year")
    .dropColumn("stripe_price_month_id")
    .dropColumn("stripe_price_year_id")
    .execute()
}
