import { sql, type Kysely } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("payment")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("userId", "varchar", (col) => col.notNull())
    .addColumn("stripeCustomerId", "varchar", (col) => col.notNull())
    .addColumn("stripePaymentIntentId", "varchar", (col) => col.notNull())
    .addColumn("status", "varchar", (col) => col.notNull())
    .addColumn("amount", "decimal", (col) => col.notNull())
    .addColumn("quantity", "integer", (col) => col.notNull().defaultTo(1))
    .addColumn("createdAt", "timestamp", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn("updatedAt", "timestamp")
    .addColumn("completedAt", "timestamp")
    .execute()

  await db.schema
    .createTable("order")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("userId", "varchar", (col) => col.notNull())
    .addColumn("amount", "decimal", (col) => col.notNull())
    .addColumn("status", "varchar", (col) => col.notNull())
    .addColumn("paymentIntentId", "varchar", (col) => col.notNull())
    .addColumn("createdAt", "timestamp", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn("updatedAt", "timestamp")
    .execute()

  await db.schema
    .createTable("orderItem")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("orderId", "integer", (col) => col.notNull())
    .addColumn("productId", "integer", (col) => col.notNull())
    .addColumn("quantity", "integer", (col) => col.notNull())
    .addColumn("price", "decimal", (col) => col.notNull())
    .addColumn("createdAt", "timestamp", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn("updatedAt", "timestamp")
    .addForeignKeyConstraint(
      "fk_order_id",
      ["orderId"],
      "order",
      ["id"],
      (cb) => cb.onDelete("cascade"),
    )
    .addForeignKeyConstraint(
      "fk_product_id",
      ["productId"],
      "products",
      ["id"],
      (cb) => cb.onDelete("cascade"),
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("order").ifExists().execute()
  await db.schema.dropTable("payment").ifExists().execute()
  await db.schema.dropTable("orderItem").ifExists().execute()
}
