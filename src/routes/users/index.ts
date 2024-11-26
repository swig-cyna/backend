import { createRouter } from "@/utils/router"

import * as handlers from "./handlers.js"
import * as routes from "./routes.js"

const router = createRouter()

const routeHandlers = [
  { route: routes.getUsers, handler: handlers.getUsers },
  { route: routes.getUserById, handler: handlers.getUserById },
]

routeHandlers.forEach(({ route, handler }) => {
  router.openapi(route, handler)
})

export default router
