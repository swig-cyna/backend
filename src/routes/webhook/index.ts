import { createRouter } from "@/utils/router"

import * as handlers from "./handlers"
import * as routes from "./routes"

const router = createRouter()

router.post(routes.handleStripeWebhook.path, handlers.handleStripeWebhook)

export default router
