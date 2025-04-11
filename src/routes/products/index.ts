import { createRouter } from "@/utils/router"

import * as handlers from "./handlers.js"
import * as routes from "./routes.js"

const router = createRouter()

router.openapi(routes.getProducts, handlers.getProducts)
router.openapi(routes.getProductById, handlers.getProduct)
router.openapi(routes.createProduct, handlers.createProduct)
router.openapi(routes.updateProduct, handlers.updateProduct)
router.openapi(routes.addImageProduct, handlers.addImageProduct)
router.openapi(routes.deleteProduct, handlers.deleteProduct)

export default router
