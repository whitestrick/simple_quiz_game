// Each question has the text, four choices, and the index (0-3) of the correct choice.
const questions = [
  {
    question: "Which keyword declares a variable that cannot be reassigned?",
    choices: ["var", "let", "const", "static"],
    answer: 2
  },
  {
    question: "Which array method adds an item to the end of an array?",
    choices: ["push()", "pop()", "shift()", "unshift()"],
    answer: 0
  },
  {
    question: "What does JSON stand for?",
    choices: [
      "Java Standard Object Naming",
      "JavaScript Online Network",
      "JavaScript Object Notation",
      "Joined Script Object Notes"
    ],
    answer: 2
  },
  {
    question: "Which symbol is used for the spread operator?",
    choices: ["&&", "...", "=>", "??"],
    answer: 1
  },
  {
    question: "What does the await keyword do inside an async function?",
    choices: [
      "Stops the whole program",
      "Waits for a promise to settle",
      "Creates a new function",
      "Loops through an array"
    ],
    answer: 1
  },
  {
    question: "Which array method creates a new array by changing every item?",
    choices: ["filter()", "forEach()", "reduce()", "map()"],
    answer: 3
  }
];

module.exports = { questions };
