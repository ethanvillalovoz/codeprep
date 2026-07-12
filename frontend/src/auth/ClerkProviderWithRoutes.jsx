import { ClerkProvider } from "@clerk/clerk-react"
import { BrowserRouter } from "react-router-dom"
import LiveApiProvider from "../utils/LiveApiProvider.jsx"

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Live mode requires VITE_CLERK_PUBLISHABLE_KEY")
}

export default function ClerkProviderWithRoutes({ children }) {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <LiveApiProvider>{children}</LiveApiProvider>
      </BrowserRouter>
    </ClerkProvider>
  )
}
