import { Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("product_images")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("product_id", "integer", (col) => col.notNull())
    .addColumn("file", "varchar", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addForeignKeyConstraint(
      "fk_product_id",
      ["product_id"],
      "products",
      ["id"],
      (cb) => cb.onDelete("cascade"),
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("product_images").execute()
}
