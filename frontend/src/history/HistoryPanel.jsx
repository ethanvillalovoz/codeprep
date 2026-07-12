import { useCallback, useEffect, useState } from "react"
import { MCQChallenge } from "../challenge/MCQChallenge.jsx"
import { useApi } from "../utils/api-context.js"

export function HistoryPanel() {
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const { makeRequest, mode } = useApi()

  const fetchHistory = useCallback(async () => {
    setIsLoading(true)
    setError("")
    try {
      const data = await makeRequest("my-history")
      setHistory(Array.isArray(data.challenges) ? data.challenges : [])
    } catch {
      setError("Challenge history is temporarily unavailable.")
    } finally {
      setIsLoading(false)
    }
  }, [makeRequest])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return (
    <section className="history-workspace" aria-labelledby="history-title">
      <div className="history-heading">
        <div>
          <p className="eyebrow">02 / Session record</p>
          <h1 id="history-title">Challenge history</h1>
          <p>Review the answer set and reasoning from previous generations.</p>
        </div>
        <span>{mode === "demo" ? "Demo record" : `${history.length} saved`}</span>
      </div>

      {isLoading ? <div className="history-status" role="status">Loading history</div> : null}
      {error ? (
        <div className="history-status is-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={fetchHistory}>Retry</button>
        </div>
      ) : null}
      {!isLoading && !error && history.length === 0 ? (
        <div className="history-status">No completed challenges yet.</div>
      ) : null}
      {!isLoading && !error && history.length > 0 ? (
        <div className="history-list">
          {history.map((challenge) => (
            <MCQChallenge key={challenge.id} challenge={challenge} showExplanation />
          ))}
        </div>
      ) : null}
    </section>
  )
}
