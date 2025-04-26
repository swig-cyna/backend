import { createRouter } from "@/utils/router"

import * as handlers from "./handlers"
import * as routes from "./routes"

const router = createRouter()

router.openapi(routes.getOrders, handlers.getOrders)
router.openapi(routes.getOrder, handlers.getOrder)

export default router
