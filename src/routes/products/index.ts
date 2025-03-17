import { createRouter } from "@/utils/router"

import * as handlers from "./handlers.js"
import * as routes from "./routes.js"

const router = createRouter()

const routeHandlers = [
  { route: routes.getProducts, handler: handlers.getProducts },
  { route: routes.getProductById, handler: handlers.getProduct },
  { route: routes.createProduct, handler: handlers.createProduct },
  { route: routes.updateProduct, handler: handlers.updateProduct },
]

routeHandlers.forEach(({ route, handler }) => {
  router.openapi(route, handler)
})

export default router
