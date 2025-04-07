import { createRouter } from "@/utils/router"

import * as handlers from "./handlers"
import * as routes from "./routes"

const router = createRouter()

const routeHandlers = [
  { route: routes.getSubscriptions, handler: handlers.getSubscriptions },
  { route: routes.createSubscription, handler: handlers.createSubscription },
  { route: routes.getSubscription, handler: handlers.getSubscription },
  { route: routes.cancelSubscription, handler: handlers.cancelSubscription },
]

routeHandlers.forEach(({ route, handler }) => {
  router.openapi(route, handler)
})

export default router
