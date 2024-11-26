import type { RouteConfig, RouteHandler, z } from "@hono/zod-openapi"

// @ts-expect-error
export type ZodSchema = z.ZodUnion | z.AnyZodObject | z.ZodArray<z.AnyZodObject>

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R>
