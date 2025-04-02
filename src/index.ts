import carousel from "@/routes/carousel/index.js"
import index from "@/routes/index.js"
import products from "@/routes/products/index.js"
import { configOpenApi } from "@/utils/openApi.js"
import { createRouter } from "@/utils/router.js"
import { serve } from "@hono/node-server"
import "dotenv/config"
import { cors } from "hono/cors"
import env from "./env"
import { auth } from "./utils/auth"

const app = createRouter()

app.use(
  cors({
    origin: [env.FRONTEND_URL],
    credentials: true,
  }),
)

configOpenApi(app)

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw))

const routes = [index, products, carousel]

routes.forEach((route) => {
  app.route("/", route)
})

console.log(`Server is running on http://localhost:${env.PORT}`)

serve({
  fetch: app.fetch,
  port: env.PORT,
})
