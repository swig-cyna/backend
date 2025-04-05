import { Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("carousel")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("title", "varchar", (col) => col.notNull())
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("image", "varchar", (col) => col.notNull())
    .addColumn("link", "varchar", (col) => col.notNull())
    .addColumn("position", "integer", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .execute()

  // Création d'un index sur la position pour faciliter le tri
  await db.schema
    .createIndex("carousel_position_idx")
    .on("carousel")
    .column("position")
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex("carousel_position_idx").execute()
  await db.schema.dropTable("carousel").execute()
}
