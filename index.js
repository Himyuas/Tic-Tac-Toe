"use strict";

const headingEl = document.querySelector(".heading");
const gameTableEl = document.querySelector(".game-table");
const gameBodyEl = document.getElementById("game-body");
const rstBtnEl = document.querySelector(".btn-restart");
const gameOvrEl = document.querySelector(".gameStat-txt");
const meBtnEl = document.querySelector(".me-btn");
const aiBtnEl = document.querySelector(".ai-btn");
const meTxtEl = document.querySelector(".me-txt");
const aiTxtEl = document.querySelector(".ai-txt");
const cellEls = document.querySelectorAll("td");
const soundBtn = document.querySelector(".btn-sound");

let lastMove = "o";
let sound = true;
let filledCells = [];
let mod = "";
const totalCells = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const resultHelper = ["123", "456", "789", "147", "258", "369", "159", "357"];
const resultLineMap = {
  123: "x",
  456: "x",
  789: "x",
  147: "y",
  258: "y",
  369: "y",
  159: "l",
  357: "r",
};

headingEl.classList.add("shake");

const hideAiTxt = () =>
  !aiTxtEl.classList.contains("hide") && aiTxtEl.classList.add("hide");

const hideMeTxt = () =>
  !meTxtEl.classList.contains("hide") && meTxtEl.classList.add("hide");

const startGame = () => {
  meBtnEl.classList.add("hide");
  aiBtnEl.classList.add("hide");
  gameTableEl.classList.remove("disable");
  cellEls.forEach((e) => {
    e.classList.add("startGame");
    // e.classList.add("cellShadow");
  });
  // gameTableEl.classList.add("startGame");
};

soundBtn.addEventListener("click", () => {
  soundBtn.querySelector("i").classList.toggle("fa-volume-high");
  soundBtn.querySelector("i").classList.toggle("fa-volume-xmark");
  sound = !sound;
});

meBtnEl.addEventListener("click", () => {
  mod = "me";
  sound && play("str");
  meTxtEl.classList.contains("hide") && meTxtEl.classList.remove("hide");
  hideAiTxt();
  startGame();
});

aiBtnEl.addEventListener("click", () => {
  mod = "ai";
  sound && play("str");
  aiTxtEl.classList.contains("hide") && aiTxtEl.classList.remove("hide");
  hideMeTxt();
  startGame();
});

rstBtnEl.addEventListener("click", () => {
  restart();
});

gameBodyEl.addEventListener("click", (e) => {
  if (
    ["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(e.target.id) &&
    e.target.innerText.trim() === ""
  ) {
    if (aiTxtEl.classList.contains("hide")) {
      if (lastMove === "o") {
        e.target.innerText = "x";
        lastMove = "x";
      } else {
        e.target.innerText = "o";
        lastMove = "o";
      }
      checkGameStat();
    } else {
      if (lastMove === "o") {
        e.target.innerText = "x";
        lastMove = "x";
        filledCells.push(e.target.id);
      }
      checkGameStat();
      if (!gameTableEl.classList.contains("disable")) {
        setTimeout(() => {
          sound && play("clk");
          wakeUpAiPlayer();
        }, 400);
      }
    }
    sound && play("clk");
  }
});

function wakeUpAiPlayer() {
  const Pos = calculatePos();
  document.getElementById(Pos).innerText = "o";
  filledCells.push(Pos);
  lastMove = "o";
  checkGameStat();
}

function calculatePos() {
  let resultX = "";
  let resultO = "";

  const remainingCells = totalCells.filter((v) => !filledCells.includes(v));

  gameBodyEl.querySelectorAll("td").forEach((el) => {
    if (el.innerText.trim() !== "") {
      if (el.innerText.toLowerCase() === "x") {
        resultX += el.id;
      } else if (el.innerText.toLowerCase() === "o") {
        resultO += el.id;
      }
    }
  });

  if (remainingCells.length === 8) {
    if (resultX === "5") {
      return ["1", "3", "7", "9"][Math.floor(Math.random() * 4)];
    } else {
      return "5";
    }
  }

  if (remainingCells.length === 6) {
    if (["19", "37"].includes(resultX)) {
      return ["2", "4", "6", "8"][Math.floor(Math.random() * 4)];
    }
  }

  if (remainingCells.length === 6) {
    if (["15"].includes(resultX) && resultO === "9") {
      if (remainingCells.includes("3")) return "3";
      else return "7";
    } else if (["35"].includes(resultX) && resultO === "7") {
      if (remainingCells.includes("1")) return "1";
      else return "9";
    } else if (["57"].includes(resultX) && resultO === "3") {
      if (remainingCells.includes("1")) return "1";
      else return "9";
    } else if (["59"].includes(resultX) && resultO === "1") {
      if (remainingCells.includes("3")) return "3";
      else return "7";
    }
  }

  let guessedPosO = [];
  let guessedPosX = [];
  let countX = 0;
  let countO = 0;

  for (let j = 0; j < resultHelper.length; j++) {
    let matchedCharsX = "";
    let matchedCharsO = "";
    let guessedPos = "";
    for (let k = 0; k < 3; k++) {
      if (resultX.includes(resultHelper[j][k])) {
        ++countX;
        matchedCharsX += resultHelper[j][k];
      }
      if (resultO.includes(resultHelper[j][k])) {
        ++countO;
        matchedCharsO += resultHelper[j][k];
      }
    }
    if (countO === 2) {
      guessedPos = resultHelper[j]
        .split("")
        .find((v) => !matchedCharsO.includes(v));

      if (remainingCells.includes(guessedPos)) {
        guessedPosO.push(guessedPos);
      }
    }
    if (countX === 2) {
      guessedPos = resultHelper[j]
        .split("")
        .find((v) => !matchedCharsX.includes(v));

      if (remainingCells.includes(guessedPos)) {
        guessedPosX.push(guessedPos);
      }
    }
    countX = 0;
    countO = 0;
  }

  if (guessedPosO.length !== 0 || guessedPosX.length !== 0) {
    if (guessedPosO.length === 0) {
      return guessedPosX[0];
    } else {
      return guessedPosO[0];
    }
  } else {
    if (guessedPosX.length === 0 && guessedPosO.length === 0) {
      let allGuessedPos = [];

      for (let i = 0; i < resultHelper.length; i++) {
        let count1 = 0;
        let count2 = 0;
        let guessedPos = "";
        for (let j = 0; j < 3; j++) {
          if (resultO.includes(resultHelper[i][j])) {
            count1++;
          } else if (remainingCells.includes(resultHelper[i][j])) {
            count2++;
            guessedPos += resultHelper[i][j];
          }
        }
        if (count1 === 1 && count2 === 2) {
          allGuessedPos.push(guessedPos);
        }
      }

      allGuessedPos = allGuessedPos.join("").split("");

      let guessedPos = "";

      allGuessedPos.forEach((v) => {
        switch (v) {
          case "1":
            if (resultX.includes("2") && resultX.includes("4")) {
              guessedPos = v;
            }
            break;
          case "2":
            if (!resultX.includes("1") && !resultX.includes("3")) {
              guessedPos = v;
            }
            break;
          case "3":
            if (resultX.includes("2") && resultX.includes("6")) {
              guessedPos = v;
            }
            break;
          case "4":
            if (!resultX.includes("1") && !resultX.includes("7")) {
              guessedPos = v;
            }
            break;
          case "6":
            if (!resultX.includes("3") && !resultX.includes("9")) {
              guessedPos = v;
            }
            break;
          case "7":
            if (resultX.includes("4") && resultX.includes("8")) {
              guessedPos = v;
            }
            break;
          case "8":
            if (!resultX.includes("7") && !resultX.includes("9")) {
              guessedPos = v;
            }
            break;
          case "9":
            if (resultX.includes("6") && resultX.includes("8")) {
              guessedPos = v;
            }
            break;
          default:
        }
      });
      if (guessedPos) return guessedPos;
    }

    const randomPos = Math.floor(Math.random() * remainingCells.length);
    return remainingCells[randomPos];
  }
}

function checkGameStat() {
  let countEmptyCells = 0;
  let resultO = "";
  let resultX = "";
  gameBodyEl.querySelectorAll("td").forEach((el) => {
    if (el.innerText.trim() === "") {
      ++countEmptyCells;
    } else {
      if (el.innerText.toLowerCase() === "x") {
        resultX += el.id;
      } else if (el.innerText.toLowerCase() === "o") {
        resultO += el.id;
      }
    }
  });

  for (let j = 0; j < resultHelper.length; j++) {
    let winResO = "";
    let winResX = "";
    for (let k = 0; k < 3; k++) {
      if (resultO.includes(resultHelper[j][k])) {
        winResO += resultHelper[j][k];
      }
      if (resultX.includes(resultHelper[j][k])) {
        winResX += resultHelper[j][k];
      }
    }
    if (winResO.trim().length === 3) {
      sound && play("win");
      gameOvrEl.classList.remove("hide");
      hideMeTxt();
      hideAiTxt();
      let text = "";
      text = mod === "me" ? "O WON!!!" : "AI WON!!!";
      gameOvrEl.innerText = text;

      winResO.split("").map((id, i) => {
        const el = document.createElement("span");
        el.classList.add(resultLineMap[winResO] + "-line");
        setTimeout(() => {
          document.getElementById(id).insertAdjacentElement("afterbegin", el);
        }, 80 * i);
      });

      gameTableEl.classList.add("disable");
      return;
    } else if (winResX.trim().length === 3) {
      sound && play("win");
      gameOvrEl.classList.remove("hide");
      hideMeTxt();
      hideAiTxt();
      let text = "";
      text = mod === "me" ? "X WON!!!" : "YOU WON!!!";
      gameOvrEl.innerText = text;

      winResX.split("").map((id, i) => {
        const el = document.createElement("span");
        el.classList.add(resultLineMap[winResX] + "-line");
        setTimeout(() => {
          document.getElementById(id).insertAdjacentElement("afterbegin", el);
        }, 80 * i);
      });

      gameTableEl.classList.add("disable");
      return;
    }
  }

  if (countEmptyCells === 0) {
    sound && play("ovr");
    gameOvrEl.classList.remove("hide");
    gameOvrEl.innerText = "Game Over";
    gameTableEl.classList.add("disable");
    hideMeTxt();
    hideAiTxt();
  }
}

function restart() {
  sound && play("clk");
  lastMove = "o";
  filledCells = [];
  hideMeTxt();
  hideAiTxt();
  gameOvrEl.classList.add("hide");
  gameBodyEl.querySelectorAll("td").forEach((el) => (el.innerText = ""));
  gameTableEl.classList.remove("disable");
  aiBtnEl.classList.remove("hide");
  meBtnEl.classList.remove("hide");
  gameTableEl.classList.add("disable");
  headingEl.classList.remove("shake");
  cellEls.forEach((e) => {
    e.classList.remove("startGame");
    // e.classList.remove("cellShadow");
  });
  // gameTableEl.classList.remove("startGame");
  setTimeout(() => {
    headingEl.classList.add("shake");
  }, 50);
}

let preAudio;

function play(audioName) {
  if (preAudio) {
    preAudio.pause();
  }
  let audio;
  switch (audioName) {
    case "str":
      audio = new Audio("audio/startSound.mp3");
      break;
    case "clk":
      audio = new Audio("audio/click.mp3");
      break;
    case "win":
      audio = new Audio("audio/WinSound.mp3");
      break;
    case "ovr":
      audio = new Audio("audio/gameOver.mp3");
      break;
    default:
      console.log("No Audio found");
  }
  audio.play();
}
