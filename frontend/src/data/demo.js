const now = new Date().toISOString()

export const DEMO_CHALLENGES = {
  easy: {
    id: 101,
    difficulty: "easy",
    title: "Which operation appends an item to the end of a Python list?",
    options: [
      "items.append(value)",
      "items.add(value)",
      "items.push(value)",
      "items.insert(value)",
    ],
    correct_answer_id: 0,
    concept: "Python sequence mutation",
    explanation: "list.append(value) mutates the list by adding one item at its end. insert() requires both an index and a value.",
    timestamp: now,
  },
  medium: {
    id: 102,
    difficulty: "medium",
    title: "What is the time complexity of finding a value in a balanced binary search tree?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correct_answer_id: 1,
    concept: "Balanced-tree search height",
    explanation: "Each comparison discards roughly half of the remaining subtree, so the search follows one root-to-leaf path of height O(log n).",
    timestamp: now,
  },
  hard: {
    id: 103,
    difficulty: "hard",
    title: "Which consistency guarantee prevents a read from observing an older value after it has observed a newer one?",
    options: [
      "Read-your-writes consistency",
      "Monotonic read consistency",
      "Causal delivery",
      "Eventual consistency",
    ],
    correct_answer_id: 1,
    concept: "Client-centric consistency guarantees",
    explanation: "Monotonic reads guarantee that successive reads by the same client never move backward to an older version.",
    timestamp: now,
  },
}

export const DEMO_HISTORY = [
  DEMO_CHALLENGES.hard,
  DEMO_CHALLENGES.medium,
  DEMO_CHALLENGES.easy,
]
