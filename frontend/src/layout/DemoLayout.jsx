import { NavLink, Outlet } from "react-router-dom"

export default function DemoLayout() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <NavLink className="brand" to="/" aria-label="CodePrep home">
          <strong>CodePrep</strong>
          <small>technical interview practice</small>
        </NavLink>
        <div className="header-actions">
          <nav aria-label="Primary navigation">
            <NavLink to="/" end>Practice</NavLink>
            <NavLink to="/history">History</NavLink>
          </nav>
          <span className="mode-label">Demo</span>
          <a href="https://github.com/ethanvillalovoz/codeprep" target="_blank" rel="noreferrer">Repository</a>
        </div>
      </header>
      <main className="app-main"><Outlet /></main>
    </div>
  )
}
