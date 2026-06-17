import { buildApp } from "./app.js"
import { getApiConfig } from "./config/index.js"
import { loadLocalEnv } from "./config/load-env.js"

loadLocalEnv()

const config = getApiConfig()
const app = await buildApp()

try {
  await app.listen({
    host: config.host,
    port: config.port,
  })
} catch (error) {
  app.log.error({ err: error }, "api_startup_failed")
  process.exitCode = 1
}
