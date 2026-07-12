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
      <div className="challenge-meta">
        <span>{challenge.difficulty}</span>
        <span>{showExplanation ? "Completed" : answered ? (correct ? "Correct" : "Review") : "Unanswered"}</span>
      </div>
      <h2>{challenge.title}</h2>

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
            <span>{optionLabels[index] ?? index + 1}</span>
            <code>{option}</code>
          </button>
        ))}
      </div>

      {reveal ? (
        <section className="explanation" aria-label="Answer explanation">
          <span>Explanation</span>
          <p>{challenge.explanation}</p>
        </section>
      ) : null}

      {answered ? (
        <div className="rating" aria-label="Challenge feedback">
          <span>Challenge quality</span>
          <button type="button" className={rating === "useful" ? "is-selected" : ""} onClick={() => setRating("useful")}>Useful</button>
          <button type="button" className={rating === "needs-work" ? "is-selected" : ""} onClick={() => setRating("needs-work")}>Needs work</button>
        </div>
      ) : null}
    </article>
  )
}
