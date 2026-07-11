import { useCallback, useRef } from "react"
import { DEMO_CHALLENGES, DEMO_HISTORY } from "../data/demo.js"
import { ApiContext } from "./api-context.js"

export default function DemoApiProvider({ children }) {
  const quotaRemaining = useRef(47)

  const makeRequest = useCallback(async (endpoint, options = {}) => {
    await new Promise((resolve) => setTimeout(resolve, endpoint === "generate-challenge" ? 650 : 180))

    if (endpoint === "quota") {
      return { quota_remaining: quotaRemaining.current, last_reset_date: new Date().toISOString() }
    }
    if (endpoint === "my-history") return { challenges: DEMO_HISTORY }
    if (endpoint === "generate-challenge") {
      const payload = JSON.parse(options.body || "{}")
      quotaRemaining.current = Math.max(0, quotaRemaining.current - 1)
      return DEMO_CHALLENGES[payload.difficulty] || DEMO_CHALLENGES.easy
    }
    throw new Error(`Unknown demo endpoint: ${endpoint}`)
  }, [])

  return <ApiContext.Provider value={{ makeRequest, mode: "demo" }}>{children}</ApiContext.Provider>
}
