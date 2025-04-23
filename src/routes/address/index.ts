import { createRouter } from "@/utils/router"
import * as handlers from "./handlers"
import * as routes from "./routes"

const router = createRouter()

router.openapi(routes.createAddress, handlers.createAddress)
router.openapi(routes.getAddresses, handlers.getAddresses)
router.openapi(routes.updateAddress, handlers.updateAddress)
router.openapi(routes.deleteAddress, handlers.deleteAddress)

export default router
