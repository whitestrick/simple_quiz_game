const test = require("node:test");
const assert = require("node:assert/strict");
const {
  formatChoices,
  parseAnswer,
  isCorrect,
  calculateScore,
  getStatus,
  getRating
} = require("../quiz");

test("formatChoices adds a letter in front of each choice", function () {
  assert.deepEqual(formatChoices(["var", "let"]), ["A) var", "B) let"]);
});

test("parseAnswer accepts lowercase letters and extra spaces", function () {
  assert.equal(parseAnswer(" c ", 4), 2);
});

test("parseAnswer rejects invalid input", function () {
  assert.equal(parseAnswer("", 4), -1);
  assert.equal(parseAnswer("Z", 4), -1);
  assert.equal(parseAnswer("D", 3), -1);
});

test("isCorrect compares the chosen index with the answer", function () {
  const question = { answer: 2 };
  assert.equal(isCorrect(question, 2), true);
  assert.equal(isCorrect(question, 1), false);
});

test("calculateScore counts only the correct results", function () {
  const results = [{ correct: true }, { correct: false }, { correct: true }];
  assert.equal(calculateScore(results), 2);
});

test("calculateScore returns 0 for an empty list", function () {
  assert.equal(calculateScore([]), 0);
});

test("getStatus reports timed out, correct and incorrect", function () {
  assert.equal(getStatus({ timedOut: true, correct: false }), "Timed out");
  assert.equal(getStatus({ timedOut: false, correct: true }), "Correct");
  assert.equal(getStatus({ timedOut: false, correct: false }), "Incorrect");
});

test("getRating gives a message that matches the score", function () {
  assert.equal(getRating(6, 6), "Perfect score!");
  assert.equal(getRating(5, 6), "Great job!");
  assert.equal(getRating(0, 6), "Keep studying, you will get there!");
});
