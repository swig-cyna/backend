import { createRouter } from "@/utils/router"

import * as handlers from "./handlers.js"
import * as routes from "./routes.js"

const router = createRouter()

const routeHandlers = [
  { route: routes.signIn, handler: handlers.signIn },
  { route: routes.signUp, handler: handlers.signUp },
]

routeHandlers.forEach(({ route, handler }) => {
  router.openapi(route, handler)
})

export default router
