import { createRouter } from "@/utils/router"

import * as handlers from "./handlers"
import * as routes from "./routes"

const router = createRouter()

router.openapi(routes.getOrders, handlers.getOrders)
router.openapi(routes.getOrder, handlers.getOrder)
router.openapi(routes.updateShippingAddress, handlers.updateShippingAddress)
router.openapi(routes.updateBillingAddress, handlers.updateBillingAddress)

export default router
