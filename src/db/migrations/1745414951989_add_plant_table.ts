import { sql, type Kysely } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("plants")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("price", "decimal", (col) =>
      col.notNull().check(sql`price >= 0`),
    )
    .addColumn("discount", "decimal", (col) => col.notNull())
    .addColumn("description", "text")
    .addColumn("interval", "text", (col) => col.notNull().defaultTo("month"))
    .addColumn("stripe_product_id", "text", (col) => col.notNull().unique())
    .addColumn("stripe_price_id", "text", (col) => col.notNull().unique())
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute()

  await db.schema
    .alterTable("subscription")
    .dropColumn("productId")
    .addColumn("plantId", "integer", (col) => col.notNull())
    .alterColumn("canceledAt", (col) => col.dropNotNull())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("plants").execute()
}
