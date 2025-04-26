import { sql, type Kysely } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("address")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("user_id", "text", (col) =>
      col.references("user.id").onDelete("cascade").notNull(),
    )
    .addColumn("alias", "varchar(50)", (col) => col.notNull())
    .addColumn("line1", "varchar(255)", (col) => col.notNull())
    .addColumn("line2", "varchar(255)")
    .addColumn("city", "varchar(100)", (col) => col.notNull())
    .addColumn("postal_code", "varchar(20)", (col) => col.notNull())
    .addColumn("country", "varchar(2)", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .execute()

  await db.schema
    .createIndex("address_user_id_idx")
    .on("address")
    .column("user_id")
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("address").execute()
}
