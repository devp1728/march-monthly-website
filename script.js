const wordList = [
    'word',
    'bazinga',
    'bacon',
    'egg',
    'cheese',
    'montecalvo',
    'mandem',
    'crodie',
    'yute',
    'mango'
]

let selectedWord = ''
let displayedWord = ''
let wrongGuesses = 0
let guessedLetters = []
const maxMistakes = 5
let wrongGuessImages = [
  '/img/shamrock1.jpg',
  '/img/shamrock2.jpg',
  '/img/shamrock4.jpg',
  '/img/shamrock5.jpg',
  '/img/shamrock6.jpg'
];
let winCount = 0;
let lossCount = 0;

function startGame (level) {
  selectedWord = getRandomWord(level)

  //Update Difficulty Display Div
  updateDifficultyDisplay(level)

  //Create the placeholder's for the selected word
  displayedWord = '_'.repeat(selectedWord.length)
  //display the updated Word
  document.getElementById('wordDisplay').textContent = displayedWord
    .split('')
    .join(' ')

  //Hide Difficulty Selection and Show Game Area & Difficulty Box
  //Add d-none to the #difficultySelection div
  document.getElementById('difficultySelection').classList.add('d-none')

  //remove d-none from #difficultyBox & #gameArea
  document.getElementById('gameArea').classList.remove('d-none')
  document.getElementById('difficultyBox').classList.remove('d-none')

  //add d-block to #difficultyBox & #gameArea
  document.getElementById('gameArea').classList.add('d-block')
  document.getElementById('difficultyBox').classList.add('d-block')
}

function getRandomWord (level) {
  let filteredWords = wordList.filter(word => {
    if (level === 'easy') return word.length <= 4 // Easy: 4 or fewer letters
    if (level === 'medium') return word.length >= 5 && word.length <= 7 // Medium: 5-7 letters
    if (level === 'hard') return word.length >= 8 // Hard: 8+ letters
  })
  //Select and return a random word from the filtered list
  return filteredWords[Math.floor(Math.random() * filteredWords.length)]
}

function updateDifficultyDisplay (level) {
  let difficultyBox = document.getElementById('difficultyBox')

  //Remove any previous difficulty classes ('easy', 'medium', 'hard')
  difficultyBox.classList.remove('easy', 'medium', 'hard')

  //Set text & apply class dynamically using template literals
  difficultyBox.textContent = `Difficulty: ${
    level.charAt(0).toUpperCase() + level.slice(1)
  }`

  //apply the appropriate CSS style for chosen Difficulty
  difficultyBox.classList.add(level)
}

function guessLetter () {
  let inputField = document.getElementById('letterInput') // Get input field
  let guessedLetter = inputField.value.toLowerCase() // Convert input to lowercase

  //Check if input is a valid letter (a-z)
  if (!guessedLetter.match(/^[a-z]$/)) {
    alert('Please enter a valid letter (A-Z)!') // Alert user if invalid input
    inputField.value = '' // Clear input field
    return // Exit function
  }

  // Check if letter was already guessed  using .includes()
  if (guessedLetters.includes(guessedLetter)) {
    alert(`You already guessed '${guessedLetter}'. Try a different letter!`)
    inputField.value = '' // Clear input field
    return // Exit function
  } else {
    //Store guessed letter in guessedLetters Array
    guessedLetters.push(guessedLetter)
  }

  // Check if guessed letter is in the selected word
  if (selectedWord.includes(guessedLetter)) {
    correctGuess(guessedLetter)
  } else {
    wrongGuess(guessedLetter)
  }

  inputField.value = '' // Clear input field
  inputField.focus() // Refocus input field for next guess
}

function wrongGuess (guessedLetter) {
  document.getElementById('wrongSound').play();
  wrongGuesses++ //increment the num of wrong guesses
  document.getElementById('wrongLetters').textContent += ` ${guessedLetter}` //add the guessed letter to HTML div

  document.getElementById('shamrock').src = wrongGuessImages[wrongGuesses - 1]




  if (wrongGuesses === maxMistakes) {
    endGame(false)
  } // check to see if  wrongGuesses === the maxMistakes if it is, call endGame(false)
}

function correctGuess (guessedLetter) {
  document.getElementById('correctSound').play();
  let newDisplayedWord = ''

  for (let i = 0; i < selectedWord.length; i++) {
    if (selectedWord[i] === guessedLetter) {
      newDisplayedWord += guessedLetter // Replace underscore with correct letter
    } else {
      newDisplayedWord += displayedWord[i] // Keep existing correct letters
    }
  }

  displayedWord = newDisplayedWord

  document.getElementById('wordDisplay').textContent = displayedWord
    .split('')
    .join(' ')

    if(!displayedWord.includes('_')){
      endGame(true)
    }
}

function endGame(won){
  let messageEl = document.getElementById('resultMessage');
  let input = document.getElementById('letterInput');
  let button = document.getElementById('guessBtn');

  if (won) {
    winCount++;
    messageEl.textContent = '🎉 You Won!';
    messageEl.classList.remove('d-none', 'text-danger');
    messageEl.classList.add('text-success');
  } else {
    lossCount++;
    messageEl.textContent = `Nah, the word was "${selectedWord}". 😞`;
    messageEl.classList.remove('d-none', 'text-success');
    messageEl.classList.add('text-danger');
  }

  // Update scoreboard
  document.getElementById('winCount').textContent = winCount;
  document.getElementById('lossCount').textContent = lossCount;

  // Disable input and guess button
  input.disabled = true;
  button.disabled = true;
}


// /Restart Game - Reloads the page to reset everything
function restartGame(){
  selectedWord = '';
  displayedWord = '';
  wrongGuesses = 0;
  guessedLetters = [];

  // Reset displayed word and wrong guesses
  document.getElementById('wordDisplay').textContent = '';
  document.getElementById('wrongLetters').textContent = 'Wrong Guesses:';
  document.getElementById('shamrock').src = 'img/shamrock.jpg';

  // Reset input field and button
  document.getElementById('letterInput').value = '';
  document.getElementById('letterInput').disabled = false;
  document.getElementById('guessBtn').disabled = false;

  // Hide game and result message, show difficulty selection again
  document.getElementById('gameArea').classList.add('d-none');
  document.getElementById('gameArea').classList.remove('d-block');
  document.getElementById('difficultyBox').classList.add('d-none');
  document.getElementById('difficultyBox').classList.remove('d-block');
  document.getElementById('difficultySelection').classList.remove('d-none');
}
// Enter key
document.getElementById('letterInput').addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    guessLetter();
  }
});
