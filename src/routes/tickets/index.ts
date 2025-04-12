import { createRouter } from "@/utils/router"

import * as handlers from "./handlers"
import * as routes from "./routes"

const router = createRouter()

router.openapi(routes.getTickets, handlers.getTicketsHandler)
router.openapi(routes.createTicket, handlers.createTicketHandler)

export default router
