import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import App from "./App.jsx"

describe("CodePrep demo", () => {
  it("generates a selected challenge and explains the committed answer", async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(await screen.findByLabelText("47 challenges remaining")).toBeVisible()
    await user.click(screen.getByRole("button", { name: "hard" }))
    await user.click(screen.getByRole("button", { name: /generate challenge/i }))

    expect(await screen.findByText(/monotonic read consistency/i, {}, { timeout: 2_000 })).toBeVisible()
    await user.click(screen.getByRole("button", { name: /monotonic read consistency/i }))
    expect(screen.getByText(/successive reads by the same client/i)).toBeVisible()
    expect(screen.getByText("Correct")).toBeVisible()
  })

  it("loads a reviewable challenge history", async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole("link", { name: "History" }))
    expect(await screen.findByRole("heading", { name: "Challenge history" })).toBeVisible()
    expect(await screen.findByText(/balanced binary search tree/i)).toBeVisible()
    expect(screen.getAllByText("Completed").length).toBeGreaterThan(0)
  })
})
