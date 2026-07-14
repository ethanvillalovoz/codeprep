import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react"
import { Navigate, NavLink, Outlet } from "react-router-dom"

const Navigation = () => (
  <nav aria-label="Primary navigation">
    <NavLink to="/" end>Practice</NavLink>
    <NavLink to="/history">History</NavLink>
  </nav>
)

export function Layout() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <NavLink className="brand" to="/" aria-label="CodePrep home">
          <strong>CodePrep</strong>
          <small>technical interview practice</small>
        </NavLink>

        <div className="header-actions">
          <SignedIn>
            <Navigation />
          </SignedIn>
          <a href="https://github.com/ethanvillalovoz/codeprep" target="_blank" rel="noreferrer">
            Repository
          </a>
          <SignedIn><UserButton /></SignedIn>
        </div>
      </header>

      <main className="app-main">
        <SignedOut><Navigate to="/sign-in" replace /></SignedOut>
        <SignedIn><Outlet /></SignedIn>
      </main>
    </div>
  )
}
