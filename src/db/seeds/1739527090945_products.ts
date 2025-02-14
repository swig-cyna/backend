import type { Kysely } from "kysely"

export async function seed(db: Kysely<any>): Promise<void> {
  await db
    .insertInto("products")
    .values([
      { name: "Product 1", price: 10.99, description: "Description 1" },
      { name: "Product 2", price: 19.99, description: "Description 2" },
      { name: "Product 3", price: 29.99, description: "Description 3" },
    ])
    .execute()
}
