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
        currency: "EUR",
        interval: "month",
        stripe_product_id: "prod_S5P4Wk9hssYNeE",
        stripe_price_id: "price_1RBEGdKcUZRyEtd6KDNO8Hbp",
      },
      {
        name: "Product 2",
        price: 19.99,
        description: "Description 2",
        currency: "EUR",
        interval: "month",
        stripe_product_id: "prod_S5P6nxO1PLP1Yj",
        stripe_price_id: "price_1RBEIGKcUZRyEtd6atSiI7GW",
      },
      {
        name: "Product 3",
        price: 29.99,
        description: "Description 3",
        currency: "EUR",
        interval: "month",
        stripe_product_id: "prod_S5P7uDFYuyy97m",
        stripe_price_id: "price_1RBEJBKcUZRyEtd6h94Z5QwO",
      },
    ])
    .execute()
}
