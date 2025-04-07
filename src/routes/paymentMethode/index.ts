import { createRouter } from "@/utils/router"

import * as handlers from "./handlers"
import * as routes from "./routes"

const router = createRouter()

const routeHandlers = [
  { route: routes.getPaymentMethods, handler: handlers.getPaymentMethods },
  { route: routes.attachPaymentMethod, handler: handlers.attachPaymentMethod },
]

routeHandlers.forEach(({ route, handler }) => {
  router.openapi(route as any, handler as any)
})

export default router
