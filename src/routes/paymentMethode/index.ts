import { createRouter } from "@/utils/router"

import * as handlers from "./handlers"
import * as routes from "./routes"

const router = createRouter()

router.openapi(routes.getPaymentMethods, handlers.getPaymentMethods)
router.openapi(routes.attachPaymentMethod, handlers.attachPaymentMethod)
router.openapi(routes.updatePaymentMethod, handlers.updatePaymentMethod)
router.openapi(routes.deletePaymentMethod, handlers.deletePaymentMethod)

export default router
