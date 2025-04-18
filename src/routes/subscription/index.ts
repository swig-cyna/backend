import { createRouter } from "@/utils/router"

import * as handlers from "./handlers"
import * as routes from "./routes"

const router = createRouter()

router.openapi(routes.getSubscriptions, handlers.getSubscriptions)
router.openapi(routes.createSubscription, handlers.createSubscription)
router.openapi(routes.getSubscription, handlers.getSubscription)
router.openapi(routes.cancelSubscription, handlers.cancelSubscription)

export default router
