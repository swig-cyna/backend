import type { OpenAPIHono } from "@hono/zod-openapi"
import packageJson from "@package"
import { apiReference } from "@scalar/hono-api-reference"

export const configOpenApi = (app: OpenAPIHono) => {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: packageJson.version,
      title: "Market API",
    }
  })

  app.get(
    "/reference",
    apiReference({
      theme: "purple",
      layout: "classic",
      defaultHttpClient: {
        targetKey: "javascript",
        clientKey: "fetch",
      },
      spec: {
        url: "/doc",
      },
    })
  )
}
