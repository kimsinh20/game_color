import { GAME_STATUS, PAIRS_COUNT } from "./constants.js";
import {
  getActiveColorList,
  getColorElementList,
  getPlayAgainButton,
  getTimerElement,
  getUlElementList,
} from "./selectors.js";
import {
  createTimer,
  getRandomColorPairs,
  hideReplayButton,
  setcolorBackground,
  setTimerText,
  showReplayButton,
} from "./utils.js";
// Global variables
let selections = [];
let gameStatus = GAME_STATUS.PLAYING;
// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

const timer = createTimer({
  seconds: 30,
  onchane: handleOnChane,
  onFinish: handleOnFinish,
});
function handleOnChane(seconds) {
  // console.log("onchane", seconds);
  const addTimer = getTimerElement();
  setTimerText(seconds);
}
function handleOnFinish() {
  const addTimer = getTimerElement();
  setTimerText("Game Over");
  gameStatus = GAME_STATUS.FINISHED;
  // attachEventForAgainButon();
  showReplayButton();
}

const initColors = () => {
  //radom
  const colorList = getRandomColorPairs(PAIRS_COUNT);
  // add li
  const liList = getColorElementList();
  liList.forEach((liElement, index) => {
    liElement.dataset.color = colorList[index];
    const overlayElement = liElement.querySelector(".overlay");
    if (overlayElement) overlayElement.style.backgroundColor = colorList[index];
  });
};

const handleColorList = (liElement) => {
  const shouldBlockClick = [
    GAME_STATUS.BLOCKING,
    GAME_STATUS.FINISHED,
  ].includes(gameStatus);
  const numberClick = liElement.classList.contains("active");
  if (!liElement || shouldBlockClick || numberClick) return;
  liElement.classList.add("active");

  selections.push(liElement);
  if (selections.length < 2) return;

  const firtsColor = selections[0].dataset.color;
  const secondColor = selections[1].dataset.color;
  const isMatch = firtsColor === secondColor;
  if (isMatch) {
    const isWin = getActiveColorList().length === 0;
    if (isWin) {
      showReplayButton();
      setTimerText("💕 you win ✨");
      timer.clear();
      setcolorBackground();
      gameStatus = GAME_STATUS.FINISHED;
    }
    selections = [];
    return;
  }
  gameStatus = GAME_STATUS.BLOCKING;
  setTimeout(() => {
    selections[0].classList.remove("active");
    selections[1].classList.remove("active");
    selections = [];
    gameStatus = GAME_STATUS.PLAYING;
    if (gameStatus === GAME_STATUS.FINISHED) {
      gameStatus = GAME_STATUS.PLAYING;
    }
  }, 500);
};

const attachEventForColorList = () => {
  const ulElement = getUlElementList();
  if (!ulElement) return;
  ulElement.addEventListener("click", (event) => {
    if (event.target.tagName !== "LI") return;
    handleColorList(event.target);
  });
};
function resetGame() {
  gameStatus = GAME_STATUS.PLAYING;
  selections = [];

  const colorList = getColorElementList();
  if (!colorList) return;
  for (let color of colorList) {
    color.classList.remove("active");
  }

  hideReplayButton();
  setTimerText("");
  initColors();
  startTimer();
}
function attachEventForAgainButon() {
  const playAgainButon = getPlayAgainButton();
  if (!playAgainButon) return;
  playAgainButon.addEventListener("click", resetGame);
}
function startTimer() {
  timer.start();
}
(() => {
  initColors();
  attachEventForColorList();
  attachEventForAgainButon();
  startTimer();
})();
