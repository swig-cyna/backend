import address from "@/routes/address/index.js"
import carousel from "@/routes/carousel/index.js"
import categories from "@/routes/categories/index.js"
import index from "@/routes/index.js"
import orders from "@/routes/orders/index.js"
import paymentIntent from "@/routes/paymentIntent/index.js"
import paymentMethode from "@/routes/paymentMethode/index.js"
import products from "@/routes/products/index.js"
import stripe from "@/routes/subscription/index.js"
import tickets from "@/routes/tickets/index.js"
import users from "@/routes/users/index.js"
import webhook from "@/routes/webhook/index.js"
import { configOpenApi } from "@/utils/openApi.js"
import { createRouter } from "@/utils/router.js"
import { serve } from "@hono/node-server"
import "dotenv/config"
import { cors } from "hono/cors"
import { cronScheduler } from "./crons/scheduler"
import env from "./env"
import { auth } from "./utils/auth"
import { dashboardMiddleware, sessionMiddleware } from "./utils/authMiddleware"

const app = createRouter()

app.use("*", sessionMiddleware)

app.use(
  cors({
    origin: [env.FRONTEND_URL],
    credentials: true,
  }),
)

app.on(["POST", "GET"], "/api/auth/**", dashboardMiddleware, (c) =>
  auth.handler(c.req.raw),
)

configOpenApi(app)

const routes = [
  address,
  carousel,
  categories,
  index,
  paymentIntent,
  paymentMethode,
  products,
  stripe,
  tickets,
  users,
  webhook,
  categories,
  orders,
]

routes.forEach((route) => {
  app.route("/", route)
})

console.log(`Server is running on http://localhost:${env.PORT}`)

serve({
  fetch: app.fetch,
  port: env.PORT,
})

cronScheduler()
