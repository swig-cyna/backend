import { z } from "@hono/zod-openapi"

export const CarouselSlideSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
  link: z.string().url(),
  position: z.number(),
})

export const CarouselSlidePositionSchema = z.object({
  position: z.number(),
})

export type CarouselSlide = z.infer<typeof CarouselSlideSchema>
