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
      <div className="practice-heading">
        <div>
          <p className="eyebrow">01 / Practice workspace</p>
          <h1 id="practice-title">Practice the decision, not the trivia.</h1>
          <p className="practice-copy">
            Generate one focused multiple-choice challenge, commit to an answer,
            then inspect the reasoning.
          </p>
        </div>
        <div className="session-meta">
          <span>{mode === "demo" ? "Demo session" : "Authenticated session"}</span>
          <strong>{remaining} / {quotaMax}</strong>
          <div className="quota-track" aria-label={`${remaining} challenges remaining`}>
            <span style={{ width: `${remainingPercent}%` }} />
          </div>
        </div>
      </div>

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
          {isLoading ? "Generating" : challenge ? "Next challenge" : "Generate challenge"}
        </button>
      </div>

      {error ? <p className="error-message" role="alert">{error}</p> : null}

      <div className="challenge-stage" aria-live="polite">
        {isLoading ? (
          <div className="generation-state" role="status">
            <span className="pulse-dot" aria-hidden="true" />
            <p>Constructing a {difficulty} challenge and checking its answer set.</p>
          </div>
        ) : null}
        {!isLoading && challenge ? <MCQChallenge key={challenge.id} challenge={challenge} /> : null}
        {!isLoading && !challenge ? (
          <div className="empty-challenge">
            <span>Ready</span>
            <p>No active challenge</p>
          </div>
        ) : null}
      </div>
    </section>
  )
}
