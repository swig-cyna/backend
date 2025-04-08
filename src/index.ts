import carousel from "@/routes/carousel/index.js"
import index from "@/routes/index.js"
import products from "@/routes/products/index.js"
import stripe from "@/routes/subscription/index.js"
import paymentMethode from "@/routes/paymentMethode/index.js"
import { configOpenApi } from "@/utils/openApi.js"
import { createRouter } from "@/utils/router.js"
import { serve } from "@hono/node-server"
import "dotenv/config"
import { cors } from "hono/cors"
import { cronScheduler } from "./crons/scheduler"
import env from "./env"
import admin from "./routes/admin"
import { auth } from "./utils/auth"
import { sessionMiddleware } from "./utils/authMiddleware"

const app = createRouter()

app.use(sessionMiddleware)

app.use(
  cors({
    origin: [env.FRONTEND_URL],
    credentials: true,
  }),
)

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw))

app.route("/api/admin", admin)

configOpenApi(app)

const routes = [index, products, carousel, stripe, paymentMethode]
routes.forEach((route) => {
  app.route("/", route)
})

console.log(`Server is running on http://localhost:${env.PORT}`)

serve({
  fetch: app.fetch,
  port: env.PORT,
})

cronScheduler()
