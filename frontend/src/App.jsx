import { lazy, Suspense } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ChallengeGenerator } from "./challenge/ChallengeGenerator.jsx"
import { HistoryPanel } from "./history/HistoryPanel.jsx"
import DemoLayout from "./layout/DemoLayout.jsx"
import DemoApiProvider from "./utils/DemoApiProvider.jsx"
import "./App.css"

const mode = import.meta.env.VITE_CODEPREP_MODE === "live" ? "live" : "demo"
const LiveApp = lazy(() => import("./LiveApp.jsx"))

function App() {
  if (mode === "live") {
    return <Suspense fallback={<div className="app-boot">Loading CodePrep</div>}><LiveApp /></Suspense>
  }

  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <DemoApiProvider>
        <Routes>
          <Route element={<DemoLayout />}>
            <Route path="/" element={<ChallengeGenerator />} />
            <Route path="/history" element={<HistoryPanel />} />
          </Route>
        </Routes>
      </DemoApiProvider>
    </BrowserRouter>
  )
}

export default App
