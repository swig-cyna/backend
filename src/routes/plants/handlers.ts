import { db } from "@/db"
import type { AppRouteHandler } from "@/utils/types"
import { Status } from "better-status-codes"
import type { GetPlantRoute, GetPlantsRoute } from "./routes"

export const getPlants: AppRouteHandler<GetPlantsRoute> = async (c) => {
  const plants = await db.selectFrom("plants").selectAll().execute()

  return c.json(plants)
}

export const getPlant: AppRouteHandler<GetPlantRoute> = async (c) => {
  const { id: rawId } = c.req.param()

  const id = Number(rawId)

  const [plant] = await db
    .selectFrom("plants")
    .selectAll()
    .where("id", "=", id)
    .execute()

  return c.json(plant, Status.OK)
}
