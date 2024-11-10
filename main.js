// Setting Game Name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector(
  "footer"
).innerHTML = `${gameName} Game Created By Samy Elsayed 24`;

// Setting Game Options
let numberOfTries = 6;
let numberOfLetters = 6;
let currentTry = 1;
let numberOfHints = 2;

// Manage Words
let wordToGuess = "";
const words = [
  "Create",
  "Update",
  "Delete",
  "Master",
  "Branch",
  "Mainly",
  "Elzero",
  "School",
];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();

let messageDiv = document.querySelector(".message");

// Manage Hints
document.querySelector(".hint span").innerHTML = numberOfHints;
const getHintButton = document.querySelector(".hint");
getHintButton.addEventListener("click", getHint);

function generateInput() {
  const inputsContainer = document.querySelector(".inputs");

  // Create Try Div
  for (let i = 1; i <= numberOfTries; i++) {
    const tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>Try ${i}</span>`;

    if (i !== 1) tryDiv.classList.add("disabled-inputs");

    // Create The Inputs Of Each Try
    for (let j = 1; j <= numberOfLetters; j++) {
      const input = document.createElement("input");
      input.type = "text";
      input.id = `guess-${i}-letter-${j}`;
      input.setAttribute("maxlength", "1");
      tryDiv.appendChild(input);
    }
    inputsContainer.appendChild(tryDiv);
  }
  inputsContainer.children[0].children[1].focus(); // children[1] 1 because the span ele take index 0

  // Solve Problem Of Tab Btn => Disabled All Inputs Exected First Input
  const disabledInputs = document.querySelectorAll(".disabled-inputs input");
  disabledInputs.forEach((input) => {
    input.disabled = true;
  });

  // Convert To Upper Case And Go To Next Input And Move Using Keys
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    input.addEventListener("input", function () {
      // Convert To Upper Case
      this.value = this.value.toUpperCase(); // input.value
      // Go To Next Input
      const nextInput = inputs[index + 1];
      if (nextInput) nextInput.focus();
    });

    // Move Between Inputs Using Right and Left Key
    input.addEventListener("keydown", (e) => {
      const currentIndex = Array.from(inputs).indexOf(e.target); // can use same method up => inputs[index]
      if (e.key === "ArrowRight") {
        const nextIndex = currentIndex + 1;
        if (nextIndex < inputs.length) inputs[nextIndex].focus();
      }
      if (e.key === "ArrowLeft") {
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) inputs[prevIndex].focus();
      }
    });
  });
}

const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuess);
console.log(wordToGuess);
function handleGuess() {
  let successGuess = true;
  for (let i = 1; i <= numberOfLetters; i++) {
    const inputField = document.querySelector(
      `#guess-${currentTry}-letter-${i}`
    );
    const letter = inputField.value.toLowerCase();
    const actualLetter = wordToGuess[i - 1];

    // Game Logic
    if (letter === actualLetter) {
      inputField.classList.add("yes-in-place");
    } else if (wordToGuess.includes(letter) && letter !== "") {
      inputField.classList.add("not-in-place");
      successGuess = false;
    } else {
      inputField.classList.add("no");
      successGuess = false;
    }
  }

  // Check If User Win Or Lose
  if (successGuess) {
    messageDiv.innerHTML = `You Win`;
    document.querySelectorAll(".inputs input").forEach((input) => {
      input.classList.add("disabled-inputs");
    });
    guessButton.disabled = true;
    getHintButton.disabled = true;
  } else {
    document
      .querySelector(`.inputs .try-${currentTry}`)
      .classList.add("disabled-inputs");
    document
      .querySelectorAll(`.inputs .try-${currentTry} input`)
      .forEach((input) => {
        input.disabled = true;
      });

    currentTry++;

    let ele = document.querySelector(`.inputs .try-${currentTry}`);
    if (ele) {
      document
        .querySelector(`.inputs .try-${currentTry}`)
        .classList.remove("disabled-inputs");
      document
        .querySelectorAll(`.inputs .try-${currentTry} input`)
        .forEach((input) => {
          input.disabled = false;
        });
      ele.classList.remove("disabled-inputs");
      ele.children[1].focus();
    } else {
      guessButton.disabled = true;
      getHintButton.disabled = true;
      messageDiv.innerHTML = `You Lose`;
    }
  }
}

function getHint() {
  if (numberOfHints > 0) {
    numberOfHints--;
    document.querySelector(".hint span").innerHTML = numberOfHints;
  }
  if (numberOfHints === 0) {
    getHintButton.disabled = true;
  }

  let enableInputs = document.querySelectorAll("input:not([disabled])");
  let emptyEnableInputs = Array.from(enableInputs).filter(
    (input) => input.value == ""
  );

  if (emptyEnableInputs.length > 0) {
    // Random Index From Array Of EmptyEnableInputs
    let randomIndex = Math.floor(Math.random() * emptyEnableInputs.length);
    // Get The Input Of Random Index
    let randomInput = emptyEnableInputs[randomIndex];
    // Get The Index Of Random Input In Array Of EnableInputs
    let indexToFill = Array.from(enableInputs).indexOf(randomInput);

    if (indexToFill !== -1) {
      randomInput.value = wordToGuess[indexToFill].toUpperCase();
    }
  }
}

function handleBackspace(event) {
  if (event.key === "Backspace") {
    const inputs = document.querySelectorAll("input:not([disabled])");
    const currentIndex = Array.from(inputs).indexOf(document.activeElement);
    if (currentIndex > 0) {
      const currentInput = inputs[currentIndex];
      const prevInput = inputs[currentIndex - 1];
      currentInput.value = "";
      prevInput.value = "";
      prevInput.focus();
    }
  }
}

document.addEventListener("keydown", handleBackspace);

window.onload = function () {
  generateInput();
};
