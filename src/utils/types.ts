/* eslint-disable no-unused-vars */
import type { RouteConfig, RouteHandler, z } from "@hono/zod-openapi"
import { auth } from "./auth"

// @ts-expect-error
export type ZodSchema = z.ZodUnion | z.AnyZodObject | z.ZodArray<z.AnyZodObject>

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R>

declare module "hono" {
  interface ContextVariableMap {
    user: typeof auth.$Infer.Session.user | null
    session: typeof auth.$Infer.Session.session | null
  }
}
