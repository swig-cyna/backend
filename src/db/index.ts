import { Kysely, ParseJSONResultsPlugin, PostgresDialect } from "kysely"
import pg from "pg"
import type { Database } from "./types.ts"
import env from "../env.js"

const { Pool, types } = pg
types.setTypeParser(types.builtins.NUMERIC, (value: any) => parseFloat(value))

export const dialect = new PostgresDialect({
  pool: new Pool({
    user: env.DB_USER,
    host: env.DB_HOST,
    database: env.DB_NAME,
    password: env.DB_PASSWORD,
    port: Number(env.DB_PORT),
  }),
})

export const db = new Kysely<Database>({
  dialect,
  plugins: [new ParseJSONResultsPlugin()],
})
