import { Hono } from "hono"
import { adminMiddleware } from "@/utils/authMiddleware"

const admin = new Hono()

admin.use("*", adminMiddleware)

admin.get("/", (c) => c.json({ message: "Bienvenue sur le portail admin !" }))

export default admin
