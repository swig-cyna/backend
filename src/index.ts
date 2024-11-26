import auth from "@/routes/auth/index.js"
import index from "@/routes/index.js"
import users from "@/routes/users/index.js"
import { configOpenApi } from "@/utils/openApi.js"
import { createRouter } from "@/utils/router.js"
import { serve } from "@hono/node-server"
import "dotenv/config"
import env from "./env"

const app = createRouter()

configOpenApi(app)

const routes = [index, auth, users]

routes.forEach((route) => {
  app.route("/", route)
})

console.log(`Server is running on http://localhost:${env.PORT}`)

serve({
  fetch: app.fetch,
  port: env.PORT,
})
