import { Kysely } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("categories")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("color", "varchar", (col) => col.notNull())
    .execute()

  await db.schema
    .alterTable("products")
    .addColumn("category_id", "integer", (col) =>
      col.references("categories.id").onDelete("set null"),
    )
    .execute()

  await db.schema
    .createIndex("products_category_id_idx")
    .on("products")
    .column("category_id")
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex("products_category_id_idx").execute()
  await db.schema.alterTable("products").dropColumn("category_id").execute()
  await db.schema.dropTable("categories").execute()
}
