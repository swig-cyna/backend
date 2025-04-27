import { createRouter } from "@/utils/router"

import * as handlers from "./handlers.js"
import * as routes from "./routes.js"

const router = createRouter()

router.openapi(routes.getPlants, handlers.getPlants)
router.openapi(routes.getPlant, handlers.getPlant)
router.openapi(routes.createPlant, handlers.createPlant)
router.openapi(routes.updatePlant, handlers.updatePlant)
router.openapi(routes.deletePlant, handlers.deletePlant)

export default router
