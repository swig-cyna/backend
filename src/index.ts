import index from "@/routes/index.js"
import products from "@/routes/products/index.js"
import { configOpenApi } from "@/utils/openApi.js"
import { createRouter } from "@/utils/router.js"
import { serve } from "@hono/node-server"
import "dotenv/config"
import env from "./env"
import { auth } from "./utils/auth"
import { cors } from "hono/cors"
import { sessionMiddleware } from "./utils/authMiddleware"
import admin from "./routes/admin"

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

const routes = [index, products]
routes.forEach((route) => {
  app.route("/", route)
})

console.log(`Server is running on http://localhost:${env.PORT}`)

serve({
  fetch: app.fetch,
  port: env.PORT,
})
