import { NavLink, Outlet } from "react-router-dom"

export default function DemoLayout() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <NavLink className="brand" to="/" aria-label="CodePrep home">
          <span className="brand-mark" aria-hidden="true">CP</span>
          <span><strong>CodePrep</strong><small>Interview practice</small></span>
        </NavLink>
        <div className="header-actions">
          <span className="mode-label">Demo corpus</span>
          <nav aria-label="Primary navigation">
            <NavLink to="/" end>Practice</NavLink>
            <NavLink to="/history">History</NavLink>
          </nav>
          <a href="https://github.com/ethanvillalovoz/codeprep" target="_blank" rel="noreferrer">Repository</a>
        </div>
      </header>
      <main className="app-main"><Outlet /></main>
    </div>
  )
}
