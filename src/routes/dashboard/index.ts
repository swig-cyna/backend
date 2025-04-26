import { createRouter } from "@/utils/router"

import * as handlers from "./handlers.js"
import * as routes from "./routes.js"

const router = createRouter()

router.openapi(routes.getStatistics, handlers.getStatistics)
router.openapi(routes.getRecentOrders, handlers.getRecentOrders)
router.openapi(routes.getRecentTickets, handlers.getRecentTickets)
router.openapi(routes.getSalesOverview, handlers.getSalesOverview)

export default router
