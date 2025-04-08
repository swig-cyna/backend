import { createRouter } from "@/utils/router"

import * as handlers from "./handlers.js"
import * as routes from "./routes.js"

const router = createRouter()

router.openapi(routes.getCarousel, handlers.getCarousel)
router.openapi(routes.getSlide, handlers.getCarouselSlide)
router.openapi(routes.createSlide, handlers.createCarouselSlide)
router.openapi(routes.uploadSlideImage, handlers.uploadSlideImage)
router.openapi(routes.updateSlide, handlers.updateCarouselSlide)
router.openapi(routes.changeSlidePosition, handlers.changeCarouselSlidePosition)
router.openapi(routes.deleteSlide, handlers.deleteCarouselSlide)

export default router
