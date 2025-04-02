import { createRouter } from "@/utils/router"

import * as handlers from "./handlers.js"
import * as routes from "./routes.js"

const router = createRouter()

const routeHandlers = [
  { route: routes.getCarousel, handler: handlers.getCarousel },
  { route: routes.getSlide, handler: handlers.getCarouselSlide },
  { route: routes.createSlide, handler: handlers.createCarouselSlide },
  { route: routes.uploadSlideImage, handler: handlers.uploadSlideImage },
  { route: routes.updateSlide, handler: handlers.updateCarouselSlide },
  {
    route: routes.changeSlidePosition,
    handler: handlers.changeCarouselSlidePosition,
  },
  { route: routes.deleteSlide, handler: handlers.deleteCarouselSlide },
]

routeHandlers.forEach(({ route, handler }) => {
  router.openapi(route, handler)
})

export default router
