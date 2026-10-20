const readline = require("readline/promises");
const { questions } = require("./questions");
const {
  formatChoices,
  parseAnswer,
  isCorrect,
  getCorrectAnswerText,
  calculateScore,
  getStatus,
  getRating
} = require("./quiz");

const SECONDS_PER_QUESTION = 15;
const GAME_TIME_LIMIT = 60; // seconds for the whole game

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Leave cleanly when the quiz ends or the player presses Ctrl+C.
rl.on("close", function () {
  console.log("\nThanks for playing!");
  process.exit(0);
});

// Asks one question and gives up after `seconds` (this is the timer).
// Returns what the user typed, or null if the time ran out.
async function askWithTimeout(prompt, seconds) {
  const controller = new AbortController();

  const timer = setTimeout(function () {
    controller.abort();
  }, seconds * 1000);

  try {
    return await rl.question(prompt, { signal: controller.signal });
  } catch (error) {
    if (error.name === "AbortError") {
      return null;
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

// Keeps asking until the user types a valid letter or the time runs out.
// Returns the choice index (0-3), or null if time ran out.
async function askForAnswer(question, timeLimit) {
  const deadline = Date.now() + timeLimit * 1000;
  let secondsLeft = timeLimit;

  while (secondsLeft > 0) {
    const input = await askWithTimeout("Your answer (A-D): ", secondsLeft);

    if (input === null) {
      return null;
    }

    const index = parseAnswer(input, question.choices.length);

    if (index !== -1) {
      return index;
    }

    console.log("Please type A, B, C or D.");
    secondsLeft = (deadline - Date.now()) / 1000;
  }

  return null;
}

// Shows the final score, the rating and a line for each question.
function showSummary(results, totalSeconds) {
  const score = calculateScore(results);

  console.log("\n=================================");
  console.log("            GAME OVER");
  console.log("=================================");
  console.log(`Score: ${score} out of ${questions.length}`);
  console.log(getRating(score, questions.length));
  console.log(`Total time: ${totalSeconds} seconds`);

  const lines = results.map(function (result, index) {
    return `  ${index + 1}. ${getStatus(result)} (${result.seconds}s)`;
  });
  lines.forEach(function (line) {
    console.log(line);
  });

  const notReached = questions.length - results.length;
  if (notReached > 0) {
    console.log(`  ${notReached} question(s) not reached.`);
  }
}

// Runs the quiz: shows each question in order, checks answers, tracks time.
async function playGame() {
  const results = [];
  const gameStart = Date.now();

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const gameSecondsLeft = Math.ceil(
      GAME_TIME_LIMIT - (Date.now() - gameStart) / 1000
    );

    if (gameSecondsLeft <= 0) {
      console.log("\nThe game time is up!");
      break;
    }

    // The question timer can never be longer than the time left in the game.
    const timeLimit = Math.min(SECONDS_PER_QUESTION, gameSecondsLeft);

    console.log(
      `\nQuestion ${i + 1} of ${questions.length}` +
      `   (game time left: ${gameSecondsLeft}s)`
    );
    console.log(question.question);
    formatChoices(question.choices).forEach(function (line) {
      console.log("  " + line);
    });
    console.log(`You have ${timeLimit} seconds.`);

    const questionStart = Date.now();
    const answerIndex = await askForAnswer(question, timeLimit);
    const seconds = Math.round((Date.now() - questionStart) / 1000);

    const timedOut = answerIndex === null;
    const correct = !timedOut && isCorrect(question, answerIndex);

    if (timedOut) {
      console.log(
        `\nTime's up! The correct answer was ${getCorrectAnswerText(question)}.`
      );
    } else if (correct) {
      console.log("Correct!");
    } else {
      console.log(
        `Incorrect. The correct answer was ${getCorrectAnswerText(question)}.`
      );
    }

    results.push({ correct, timedOut, seconds });
  }

  const totalSeconds = Math.round((Date.now() - gameStart) / 1000);
  showSummary(results, totalSeconds);
}

async function main() {
  console.log("=================================");
  console.log("     Welcome to the JS Quiz!");
  console.log("=================================");
  console.log(
    `${questions.length} questions, ${SECONDS_PER_QUESTION} seconds each, ` +
    `${GAME_TIME_LIMIT} seconds in total.`
  );
  console.log("Type A, B, C or D and press Enter to answer.");

  await rl.question("\nPress Enter to start...");
  await playGame();
  rl.close();
}

main().catch(function (error) {
  console.log("Something went wrong:", error.message);
  rl.close();
});
