import { NUMBER_OF_TRAIT_CARDS } from "../constants/constants.js";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getShuffledNumbers() {
  const numbers = [];
  for (let i = 1; i <= NUMBER_OF_TRAIT_CARDS; i++) {
    numbers.push(i);
  }
  return shuffleArray(numbers);
}

export default getShuffledNumbers;
