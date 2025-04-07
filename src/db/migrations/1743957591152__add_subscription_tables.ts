import { sql, type Kysely } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("subscription")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("userId", "text", (col) => col.notNull())
    .addColumn("stripeCustomerId", "text", (col) => col.notNull())
    .addColumn("stripeSubscriptionId", "text", (col) => col.notNull())
    .addColumn("status", "text", (col) => col.notNull())
    .addColumn("currentPeriodEnd", "timestamp", (col) => col.notNull())
    .addColumn("createdAt", "timestamp", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn("updatedAt", "timestamp", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn("canceledAt", "timestamp", (col) => col.notNull())
    .addColumn("quantity", "integer", (col) => col.notNull())
    .execute()

  await db.schema
    .alterTable("user")
    .addColumn("stripeCustomerId", "text")
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("subscription").execute()
}
