import { sql, type Kysely } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("products")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("price", "decimal", (col) =>
      col.notNull().check(sql`price >= 0`)
    )
    .addColumn("description", "text")
    .addColumn("currency", "text", (col) => 
      col.notNull().defaultTo("eur")
    )
    .addColumn("interval", "text", (col) =>
      col.notNull().defaultTo("month")
    )
    .addColumn("stripe_product_id", "text", (col) => col.notNull().unique())
    .addColumn("stripe_price_id", "text", (col) => col.notNull().unique())
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("products").execute()
}
