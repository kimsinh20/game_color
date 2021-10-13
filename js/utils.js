import { GAME_TIME } from "./constants.js";
import {
  getColorBackground,
  getPlayAgainButton,
  getTimerElement,
} from "./selectors.js";

const shuffle = (arr) => {
  if (!Array.isArray(arr) || arr.length <= 2) return arr;
  for (let i = arr.length - 1; i > 1; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
};
const ListBackGround = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
  "monochrome",
];
export const getRandomColorPairs = (count) => {
  const colorList = [];
  const hueList = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "purple",
    "pink",
    "monochrome",
  ];

  for (let i = 0; i < count; i++) {
    const color = window.randomColor({
      luminosity: "dark",
      hue: hueList[i % hueList.length],
    });
    colorList.push(color);
  }
  const fullColorList = [...colorList, ...colorList];
  shuffle(fullColorList);
  return fullColorList;
};
export function showReplayButton() {
  const playAgainButon = getPlayAgainButton();
  if (playAgainButon) playAgainButon.classList.add("show");
}
export function hideReplayButton() {
  const playAgainButon = getPlayAgainButton();
  if (playAgainButon) playAgainButon.classList.remove("show");
}
export function setTimerText(time) {
  const timeText = getTimerElement();
  if (timeText) timeText.textContent = time;
}
export function setcolorBackground() {
  const colorBackground = getColorBackground();
  if (colorBackground)
    colorBackground.style.backgroundColor =
      ListBackGround[Math.floor(Math.random() * 7)];
}
export const createTimer = ({ seconds, onchane, onFinish }) => {
  let interValid = null;
  function start() {
    clear();
    let currenSeconds = seconds;

    interValid = setInterval(() => {
      if (onchane) onchane(currenSeconds);
      currenSeconds--;
      if (currenSeconds < 0) {
        clear();
        onFinish?.(currenSeconds);
      }
    }, 1000);
  }
  function clear() {
    clearInterval(interValid);
  }
  return {
    start,
    clear,
  };
};
