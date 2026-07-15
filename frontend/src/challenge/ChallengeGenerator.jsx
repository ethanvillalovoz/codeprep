import { ArrowRight } from "@phosphor-icons/react"
import { useCallback, useEffect, useState } from "react"
import { MCQChallenge } from "./MCQChallenge.jsx"
import { DEMO_CHALLENGES } from "../data/demo.js"
import { useApi } from "../utils/api-context.js"

const difficulties = ["easy", "medium", "hard"]
const quotaMax = 50

export function ChallengeGenerator() {
  const { makeRequest, mode } = useApi()
  const [challenge, setChallenge] = useState(() => mode === "demo" ? DEMO_CHALLENGES.medium : null)
  const [difficulty, setDifficulty] = useState("medium")
  const [quota, setQuota] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

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
      <div className="session-strip">
        <div className="session-context">
          <span>Session 04</span>
          <h1 id="practice-title">Systems interview</h1>
        </div>
        <div className="quota-summary">
          <span>{mode === "demo" ? "Demo session" : "Authenticated session"}</span>
          <div className="quota-track" aria-label={`${remaining} challenges remaining`}>
            <span style={{ width: `${remainingPercent}%` }} />
          </div>
          <p>Runs left <strong>{remaining}</strong> of {quotaMax}</p>
        </div>
      </div>

      <div className="interview-layout">
        <div className="editor-pane">
          <div className="practice-controls">
            <p className="practice-brief">
              Pick one answer. The rationale stays hidden until you commit.
            </p>
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
              {isLoading ? "Generating" : challenge ? "New challenge" : "Generate challenge"}
              <ArrowRight size={17} weight="bold" aria-hidden="true" />
            </button>
          </div>

          {error ? <p className="error-message" role="alert">{error}</p> : null}

          <div className="challenge-stage" aria-live="polite">
            {isLoading ? (
              <div className="generation-state" role="status">
                <p>Preparing a {difficulty} challenge...</p>
              </div>
            ) : null}
            {!isLoading && challenge ? <MCQChallenge key={challenge.id} challenge={challenge} /> : null}
            {!isLoading && !challenge ? (
              <div className="empty-challenge">
                <p>Choose a difficulty, then generate a question.</p>
                <span>The explanation appears after you commit to an answer.</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
