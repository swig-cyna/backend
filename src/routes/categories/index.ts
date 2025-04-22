import { createRouter } from "@/utils/router"

import * as handlers from "./handlers.js"
import * as routes from "./routes.js"

const router = createRouter()

router.openapi(routes.getCategories, handlers.getCategories)
router.openapi(routes.getCategory, handlers.getCategory)
router.openapi(routes.createCategory, handlers.createCategory)
router.openapi(routes.updateCategory, handlers.updateCategory)
router.openapi(routes.deleteCategory, handlers.deleteCategory)

export default router
