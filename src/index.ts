import index from "@/routes/index.js"
import products from "@/routes/products/index.js"
import { configOpenApi } from "@/utils/openApi.js"
import { createRouter } from "@/utils/router.js"
import { serve } from "@hono/node-server"
import "dotenv/config"
import env from "./env"
import { auth } from "./utils/auth"

const app = createRouter()

configOpenApi(app)

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw))

const routes = [index, products]

routes.forEach((route) => {
  app.route("/", route)
})

console.log(`Server is running on http://localhost:${env.PORT}`)

serve({
  fetch: app.fetch,
  port: env.PORT,
})
