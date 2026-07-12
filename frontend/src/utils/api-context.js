import { createContext, useContext } from "react"

export const ApiContext = createContext(null)

export const useApi = () => {
  const context = useContext(ApiContext)
  if (!context) throw new Error("useApi must be used inside an API provider")
  return context
}
