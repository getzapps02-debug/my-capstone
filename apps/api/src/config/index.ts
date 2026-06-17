export type ApiConfig = {
  host: string
  port: number
}

export function getApiConfig(): ApiConfig {
  return {
    host: process.env.API_HOST ?? "127.0.0.1",
    port: Number.parseInt(process.env.API_PORT ?? "4000", 10),
  }
}
