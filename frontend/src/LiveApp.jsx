import { Route, Routes } from "react-router-dom"
import AuthenticationPage from "./auth/AuthenticationPage.jsx"
import ClerkProviderWithRoutes from "./auth/ClerkProviderWithRoutes.jsx"
import { ChallengeGenerator } from "./challenge/ChallengeGenerator.jsx"
import { HistoryPanel } from "./history/HistoryPanel.jsx"
import { Layout } from "./layout/Layout.jsx"

export default function LiveApp() {
  return (
    <ClerkProviderWithRoutes>
      <Routes>
        <Route path="/sign-in/*" element={<AuthenticationPage />} />
        <Route path="/sign-up/*" element={<AuthenticationPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<ChallengeGenerator />} />
          <Route path="/history" element={<HistoryPanel />} />
        </Route>
      </Routes>
    </ClerkProviderWithRoutes>
  )
}
