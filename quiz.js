// Helper functions for the quiz. None of them use the terminal,
// so they are easy to test on their own.

const LETTERS = ["A", "B", "C", "D"];

// Input: an array of choices. Output: an array of lines like "A) var".
function formatChoices(choices) {
  return choices.map(function (choice, index) {
    return `${LETTERS[index]}) ${choice}`;
  });
}

// Input: what the user typed and how many choices there are.
// Output: the choice index (0-3), or -1 if the input is not valid.
function parseAnswer(input, choiceCount) {
  const index = LETTERS.indexOf(input.trim().toUpperCase());

  if (index === -1 || index >= choiceCount) {
    return -1;
  }

  return index;
}

// Output: true if the chosen index is the correct one.
function isCorrect(question, answerIndex) {
  return question.answer === answerIndex;
}

// Output: the correct answer as text, e.g. "C) const".
function getCorrectAnswerText(question) {
  return `${LETTERS[question.answer]}) ${question.choices[question.answer]}`;
}

// Input: the list of results. Output: how many were correct.
function calculateScore(results) {
  return results.filter(function (result) {
    return result.correct;
  }).length;
}

// Output: "Correct", "Incorrect" or "Timed out" for one result.
function getStatus(result) {
  if (result.timedOut) {
    return "Timed out";
  }

  return result.correct ? "Correct" : "Incorrect";
}

// Output: a message that matches the player's score.
function getRating(score, total) {
  const percent = (score / total) * 100;

  if (percent === 100) {
    return "Perfect score!";
  }
  if (percent >= 70) {
    return "Great job!";
  }
  if (percent >= 40) {
    return "Not bad, keep practicing!";
  }
  return "Keep studying, you will get there!";
}

module.exports = {
  formatChoices,
  parseAnswer,
  isCorrect,
  getCorrectAnswerText,
  calculateScore,
  getStatus,
  getRating
};
