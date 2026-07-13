import { useCallback, useEffect, useState } from "react"
import { MCQChallenge } from "./MCQChallenge.jsx"
import { useApi } from "../utils/api-context.js"

const difficulties = ["easy", "medium", "hard"]
const quotaMax = 50

export function ChallengeGenerator() {
  const [challenge, setChallenge] = useState(null)
  const [difficulty, setDifficulty] = useState("medium")
  const [quota, setQuota] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { makeRequest, mode } = useApi()

  const fetchQuota = useCallback(async () => {
    try {
      setQuota(await makeRequest("quota"))
    } catch (requestError) {
      setError(requestError.message || "Quota is temporarily unavailable")
    }
  }, [makeRequest])

  useEffect(() => {
    fetchQuota()
  }, [fetchQuota])

  const generateChallenge = async () => {
    setIsLoading(true)
    setError("")
    setChallenge(null)
    try {
      const nextChallenge = await makeRequest("generate-challenge", {
        method: "POST",
        body: JSON.stringify({ difficulty }),
      })
      setChallenge(nextChallenge)
      await fetchQuota()
    } catch (requestError) {
      setError(requestError.message || "Challenge generation failed")
    } finally {
      setIsLoading(false)
    }
  }

  const remaining = quota?.quota_remaining ?? 0
  const remainingPercent = Math.max(0, Math.min(100, (remaining / quotaMax) * 100))

  return (
    <section className="practice-workspace" aria-labelledby="practice-title">
      <div className="workbench-tabs" aria-label="Open practice files">
        <span className="is-active">challenge.md</span>
        <span>session.log</span>
        <span className="branch-label">demo/main</span>
      </div>

      <div className="interview-layout">
        <aside className="briefing-pane">
          <p className="eyebrow">Session 04</p>
          <h1 id="practice-title">Systems interview</h1>
          <p className="practice-copy">Choose one answer, then inspect the technical rationale.</p>

          <ol className="session-protocol">
            <li><span>01</span><p><strong>Format</strong>Multiple choice</p></li>
            <li><span>02</span><p><strong>Focus</strong>Systems and data structures</p></li>
            <li><span>03</span><p><strong>Feedback</strong>Immediate rationale</p></li>
          </ol>

          <div className="session-meta">
            <span>{mode === "demo" ? "Demo session" : "Authenticated session"}</span>
            <div><strong>{remaining}</strong><small>of {quotaMax} runs left</small></div>
            <div className="quota-track" aria-label={`${remaining} challenges remaining`}>
              <span style={{ width: `${remainingPercent}%` }} />
            </div>
          </div>
        </aside>

        <div className="editor-pane">
          <div className="practice-controls">
            <div className="difficulty-control" aria-label="Challenge difficulty">
              <span>Difficulty</span>
              <div className="segmented-control">
                {difficulties.map((level) => (
                  <button
                    key={level}
                    type="button"
                    className={difficulty === level ? "is-active" : ""}
                    aria-pressed={difficulty === level}
                    onClick={() => setDifficulty(level)}
                    disabled={isLoading}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              className="generate-button"
              onClick={generateChallenge}
              disabled={isLoading || remaining === 0}
            >
              <span aria-hidden="true">&#9654;</span>
              {isLoading ? "Generating" : challenge ? "Next challenge" : "Generate challenge"}
            </button>
          </div>

          {error ? <p className="error-message" role="alert">{error}</p> : null}

          <div className="challenge-stage" aria-live="polite">
            {isLoading ? (
              <div className="generation-state" role="status">
                <span className="terminal-prompt" aria-hidden="true">$</span>
                <p>codeprep generate --difficulty {difficulty}<span className="terminal-cursor" aria-hidden="true" /></p>
              </div>
            ) : null}
            {!isLoading && challenge ? <MCQChallenge key={challenge.id} challenge={challenge} /> : null}
            {!isLoading && !challenge ? (
              <div className="empty-challenge">
                <div className="empty-command"><span>$</span><code>codeprep generate --difficulty {difficulty}</code></div>
                <p>Run the generator to open a reviewed challenge.</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
