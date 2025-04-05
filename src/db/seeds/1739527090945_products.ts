import type { Kysely } from "kysely"

export async function seed(db: Kysely<any>): Promise<void> {
  const existingProducts = await db.selectFrom("products").selectAll().execute()

  if (existingProducts.length > 0) {
    console.log("Products already exist")

    return
  }

  await db
    .insertInto("products")
    .values([
      {
        name: "Product 1",
        price: 10.99,
        description: "Description 1",
        stripe_product_id: "prod_123",
        stripe_price_id: "price_123",
      },
      {
        name: "Product 2",
        price: 19.99,
        description: "Description 2",
        stripe_product_id: "prod_456",
        stripe_price_id: "price_456",
      },
      {
        name: "Product 3",
        price: 29.99,
        description: "Description 3",
        stripe_product_id: "prod_789",
        stripe_price_id: "price_789",
      },
    ])
    .execute()
}
