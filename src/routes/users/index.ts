import { createRouter } from "@/utils/router"
import * as handlers from "./handlers"
import * as routes from "./routes"

const router = createRouter()
router.openapi(routes.listUsers, handlers.listUsersHandler)

export default router
