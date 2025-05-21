import { sql, type Kysely } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("passkey")
    .addColumn("id", "text", (col) => col.primaryKey().notNull())
    .addColumn("name", "text")
    .addColumn("publicKey", "text", (col) => col.notNull())
    .addColumn("userId", "text", (col) =>
      col.references("user.id").onDelete("cascade").notNull(),
    )
    .addColumn("credentialID", "text", (col) => col.notNull())
    .addColumn("counter", "integer", (col) => col.notNull())
    .addColumn("deviceType", "text")
    .addColumn("backedUp", "boolean")
    .addColumn("transports", "text")
    .addColumn("createdAt", "timestamp", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("passkey").execute()
}
