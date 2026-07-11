import { useAuth } from "@clerk/clerk-react"
import { useCallback } from "react"
import { ApiContext } from "./api-context.js"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"

export default function LiveApiProvider({ children }) {
  const { getToken } = useAuth()

  const makeRequest = useCallback(async (endpoint, options = {}) => {
    const token = await getToken()
    const response = await fetch(`${API_BASE_URL}/api/${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      signal: AbortSignal.timeout(60_000),
    })
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) {
      if (response.status === 429) throw new Error("Daily generation quota exhausted")
      throw new Error(payload.detail || "The service could not complete that request")
    }
    return payload
  }, [getToken])

  return <ApiContext.Provider value={{ makeRequest, mode: "live" }}>{children}</ApiContext.Provider>
}
