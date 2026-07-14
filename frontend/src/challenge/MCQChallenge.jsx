import { CheckCircle, ThumbsDown, ThumbsUp } from "@phosphor-icons/react"
import { useMemo, useState } from "react"

const optionLabels = ["A", "B", "C", "D"]

function parseOptions(options) {
  if (Array.isArray(options)) return options
  if (typeof options !== "string") return []
  try {
    const parsed = JSON.parse(options)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function MCQChallenge({ challenge, showExplanation = false, onCorrect }) {
  const [selectedOption, setSelectedOption] = useState(null)
  const [rating, setRating] = useState(null)
  const options = useMemo(() => parseOptions(challenge.options), [challenge.options])
  const answered = selectedOption !== null
  const reveal = showExplanation || answered
  const correct = selectedOption === challenge.correct_answer_id

  const selectOption = (index) => {
    if (answered || showExplanation) return
    setSelectedOption(index)
    if (index === challenge.correct_answer_id) onCorrect?.()
  }

  const optionClass = (index) => {
    if (!reveal) return "answer-option"
    if (index === challenge.correct_answer_id) return "answer-option is-correct"
    if (index === selectedOption) return "answer-option is-incorrect"
    return "answer-option is-muted"
  }

  return (
    <article className="challenge-card">
      <section className="question-pane">
        <header className="challenge-heading">
          <div className="challenge-meta">
            <span>Question {challenge.id}</span>
            <span>{showExplanation ? "Completed" : challenge.difficulty}</span>
          </div>
          <h2>{challenge.title}</h2>
        </header>

        <div className="options" role="group" aria-label="Answer options">
          {options.map((option, index) => (
            <button
              className={optionClass(index)}
              key={`${option}-${index}`}
              type="button"
              onClick={() => selectOption(index)}
              disabled={answered || showExplanation}
              aria-pressed={selectedOption === index}
            >
              <span className="option-label">{optionLabels[index] ?? index + 1}</span>
              <code>{option}</code>
              {reveal && index === challenge.correct_answer_id ? (
                <span className="option-result"><CheckCircle size={18} weight="fill" aria-hidden="true" />Correct</span>
              ) : null}
            </button>
          ))}
        </div>
      </section>

      <aside className="explanation" aria-label="Answer explanation">
        <span className="explanation-label">Explanation</span>
        {reveal ? (
          <>
            <div className={`decision${correct || showExplanation ? " is-correct" : " is-review"}`}>
              <CheckCircle size={22} weight="regular" aria-hidden="true" />
              <strong>{showExplanation ? "Reference answer." : correct ? "Decision accepted." : "Decision needs review."}</strong>
            </div>
            <p>{challenge.explanation}</p>
          </>
        ) : (
          <p className="explanation-empty">Choose one answer to inspect the technical rationale.</p>
        )}

        {answered ? (
          <div className="rating" aria-label="Challenge feedback">
            <span>Challenge quality</span>
            <button
              type="button"
              className={rating === "useful" ? "is-selected" : ""}
              onClick={() => setRating("useful")}
              aria-label="Mark challenge as useful"
            >
              <ThumbsUp size={17} aria-hidden="true" />Useful
            </button>
            <button
              type="button"
              className={rating === "needs-work" ? "is-selected" : ""}
              onClick={() => setRating("needs-work")}
              aria-label="Mark challenge as needing work"
            >
              <ThumbsDown size={17} aria-hidden="true" />Needs work
            </button>
          </div>
        ) : null}
      </aside>
    </article>
  )
}
