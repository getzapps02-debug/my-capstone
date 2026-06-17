import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

import * as schema from "./schema/index.js"

export type DatabaseClient = ReturnType<typeof createDatabaseClient>

export function createDatabaseClient(databaseUrl = process.env.DATABASE_URL) {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for local persistence.")
  }

  const pool = new Pool({
    connectionString: databaseUrl,
  })

  return {
    db: drizzle(pool, { schema }),
    async close() {
      await pool.end()
    },
  }
}
