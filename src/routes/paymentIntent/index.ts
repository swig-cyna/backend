import { createRouter } from "@/utils/router"

import * as handlers from "./handlers"
import * as routes from "./routes"

const router = createRouter()

router.openapi(routes.getPayments, handlers.getPayments)
router.openapi(routes.getPayment, handlers.getPayment)
router.openapi(routes.createPaymentIntent, handlers.createPaymentIntent)
router.openapi(routes.confirmPayment, handlers.confirmPayment)

export default router
