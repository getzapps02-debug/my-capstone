import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, it } from "vitest"

const runtimeRoots = ["src", "index.html", "vite.config.ts"]
const forbiddenRemotePattern = /https?:\/\/(?!127\.0\.0\.1(?::\d+)?(?:[/"'\s)]|$)|localhost(?::\d+)?(?:[/"'\s)]|$))/i
const forbiddenRuntimeImportPattern =
  /\b(?:from|import|require)\s*\(?["'](?:@?sentry|analytics|telemetry|google-analytics|googletagmanager|segment|datadog|posthog)/i

describe("local runtime assets", () => {
  it("does not load remote assets, analytics, telemetry, or third-party services", () => {
    const offenders = listRuntimeFiles()
      .map((file) => ({
        content: readFileSync(file, "utf8"),
        file,
      }))
      .filter(
        ({ content }) =>
          forbiddenRemotePattern.test(content) ||
          forbiddenRuntimeImportPattern.test(content)
      )

    expect(offenders.map((offender) => offender.file)).toEqual([])
  })
})

function listRuntimeFiles() {
  return runtimeRoots.flatMap((root) => {
    const path = join(process.cwd(), root)
    const stat = statSync(path)

    if (stat.isFile()) {
    return path.endsWith(".test.ts") || path.endsWith(".test.tsx") ? [] : [path]
  }

    return walk(path).filter(
      (file) =>
        /\.(css|html|js|jsx|ts|tsx)$/.test(file) &&
        !file.endsWith(".test.ts") &&
        !file.endsWith(".test.tsx")
    )
  })
}

function walk(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry)
    const stat = statSync(path)

    return stat.isDirectory() ? walk(path) : [path]
  })
}
