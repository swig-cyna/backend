import type { Kysely } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("user")
    .addColumn("twoFactorEnabled", "boolean", (col) =>
      col.notNull().defaultTo(false),
    )
    .execute()

  await db.schema
    .createTable("twoFactor")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("userId", "text", (col) =>
      col.references("user.id").onDelete("cascade").notNull(),
    )
    .addColumn("secret", "text", (col) => col.notNull())
    .addColumn("backupCodes", "text", (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("twoFactor").execute()

  await db.schema.alterTable("user").dropColumn("twoFactorEnabled").execute()
}
