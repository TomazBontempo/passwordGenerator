//Subfunctions ======================================================================//
function generateRandomNumber() {
  const numDigits = Math.floor(Math.random() * 3) + 1;
  let randomNumber = "";
  for (let i = 0; i < numDigits; i++) {
    const digit = Math.floor(Math.random() * 10);
    randomNumber += digit;
  }
  return randomNumber;
}

function getSpecialCharacters(resultArray) {
  const specialCharacters = [
    "!",
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "*",
    "(",
    ")",
    "_",
    "+",
    "[",
    "]",
    "{",
    "}",
    "|",
    ";",
    ":",
    "'",
    ",",
    ".",
    "<",
    ">",
    "?",
  ];
  const numSpecialCharacters = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < numSpecialCharacters; i++) {
    const specialChar =
      specialCharacters[Math.floor(Math.random() * specialCharacters.length)];
    resultArray.push(specialChar);
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Generate a random index
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
}

//Function ==========================================================================//
async function createPassword(numWords) {
  try {
    const response = await fetch(
      `https://random-word-api.herokuapp.com/word?number=${numWords}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const words = await response.json();

    const capitalizedWords = words.map((word) => {
      return word
        .split("")
        .map((char) => (Math.random() < 0.5 ? char.toUpperCase() : char))
        .join("");
    });

    const resultArray = [];

    for (let i = 0; i < numWords - 1; i++) {
      resultArray.push(capitalizedWords[i]);
      for (let j = 0; j < 2; j++) {
        const randomNumber = generateRandomNumber();
        resultArray.push(randomNumber);
      }
      // Add special characters
      getSpecialCharacters(resultArray);
    }

    // Add the last word
    resultArray.push(capitalizedWords[numWords - 1]);

    shuffleArray(resultArray);

    // Join the elements of the array into a single string
    const result = resultArray.join("");
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

//DOM manipulation ==================================================================//
document.addEventListener("DOMContentLoaded", () => {
  // Get DOM elements
  const numberOfWordsInput = document.getElementById("numberOfWords");
  const generateButton = document.getElementById("generateBtn");
  const displayPassword = document.getElementById("displayPassword");
  const copyButton = document.getElementById("clipboard");

  // Get the value from the input field
  generateButton.addEventListener("click", () => {
    const numWords = parseInt(numberOfWordsInput.value, 10);

    // Call function
    createPassword(numWords)
      .then((createdPassword) => {
        // Update the displayPassword with the generated password
        displayPassword.textContent = createdPassword;
      })
      .catch((error) => {
        console.error("Error:", error);
        displayPassword.textContent = "Password generation failed.";
      });
  });

  // Copy password to clipboard
  copyButton.addEventListener("click", () => {
    const passwordToCopy = displayPassword.textContent;
    if (passwordToCopy) {
      // Create a textarea element to temporarily hold the password
      const textarea = document.createElement("textarea");
      textarea.value = passwordToCopy;

      // Append the textarea to the document
      document.body.appendChild(textarea);

      // Select the text in the textarea
      textarea.select();

      try {
        // Attempt to copy the text to the clipboard
        document.execCommand("copy");
        console.log("Password copied to clipboard!");
        // Add an alert when the password is successfully copied
        alert("Password copied to clipboard!");
      } catch (err) {
        console.error("Unable to copy password: ", err);
      } finally {
        // Remove the textarea from the document
        document.body.removeChild(textarea);
      }
    }
  });
});
