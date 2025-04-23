import { Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createType("ticket_status")
    .asEnum(["open", "in_progress", "closed"])
    .execute()

  await db.schema
    .createTable("ticket")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("title", "varchar", (col) => col.notNull())
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("theme", "varchar", (col) => col.notNull())
    .addColumn("status", sql`ticket_status`, (col) =>
      col.notNull().defaultTo("open"),
    )
    .addColumn("user_id", "text", (col) =>
      col.references("user.id").onDelete("cascade").notNull(),
    )
    .addColumn("user_name", "varchar", (col) => col.notNull())
    .addColumn("user_email", "varchar", (col) => col.notNull())
    .addColumn("assigned_to", "text", (col) =>
      col.references("user.id").onDelete("set null"),
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn("closed_at", "timestamp")
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("ticket").execute()
  await db.schema.dropType("ticket_status").execute()
}
