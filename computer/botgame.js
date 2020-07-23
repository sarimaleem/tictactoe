import { botPick, getEmptySquares, getEmptySquaresBFS } from "./minimax.js";
import { evaluateBoard } from "./eval.js";

const queryString = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
const username = queryString.name;
const difficulty = Number(queryString.difficulty);
console.log(difficulty);

let board = document.getElementById("board");
let gameOver = false;
let thinking = false;
let size = 11;
let prev = { row: 0, col: 0 };
let gameBoard = Array.from(Array(size), () => new Array(size).fill("-"));

document.getElementById("reset").onclick = resetGame;
createBoard();

function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < size; i++) {
    let row = document.createElement("div");
    row.className = "row";
    for (let j = 0; j < size; j++) {
      let square = document.createElement("div");
      square.className = "square";
      square.setAttribute("row", i);
      square.setAttribute("col", j);

      if(j === 0) { 
        square.style.borderLeft = 'none'
      }
      if(i === 0) { 
        square.style.borderTop = 'none'
      }

      row.appendChild(square);
    }
    board.appendChild(row);
  }
}

function resetGame() {
  createBoard();
  gameBoard = Array.from(Array(size), () => new Array(size).fill("-"));
  gameOver = false;
  document.getElementById("winner").innerHTML = "";
}

function checkWin(player) {
  //horizontal check

  let length = gameBoard.length; //this is conditional on it being a square

  for (let col = 0; col < length - 4; col++) {
    for (let row = 0; row < length; row++) {
      if (
        gameBoard[row][col] == player &&
        gameBoard[row][col + 1] == player &&
        gameBoard[row][col + 2] == player &&
        gameBoard[row][col + 3] == player &&
        gameBoard[row][col + 4] == player
      ) {
        return true;
      }
    }
  }

  //check vertical
  for (let row = 0; row < length - 4; row++) {
    for (let col = 0; col < length; col++) {
      if (
        gameBoard[row][col] == player &&
        gameBoard[row + 1][col] == player &&
        gameBoard[row + 2][col] == player &&
        gameBoard[row + 3][col] == player &&
        gameBoard[row + 4][col] == player
      ) {
        return true;
      }
    }
  }

  //check antidiagonal
  for (let col = 0; col < length - 4; col++) {
    for (let row = 4; row < length; row++) {
      if (
        gameBoard[row][col] == player &&
        gameBoard[row - 1][col + 1] == player &&
        gameBoard[row - 2][col + 2] == player &&
        gameBoard[row - 3][col + 3] == player &&
        gameBoard[row - 4][col + 4] == player
      ) {
        return true;
      }
    }
  }
  //check diagonal
  for (let col = 0; col < length - 4; col++) {
    for (let row = 0; row < length - 4; row++) {
      if (
        gameBoard[row][col] == player &&
        gameBoard[row + 1][col + 1] == player &&
        gameBoard[row + 2][col + 2] == player &&
        gameBoard[row + 3][col + 3] == player &&
        gameBoard[row + 4][col + 4] == player
      ) {
        return true;
      }
    }
  }
  return false;
}

function checkTie() {
  return getEmptySquares(gameBoard).length === 0;
}

$(document.body).on("click", ".square", function () {
  let row = Number(this.getAttribute("row"));
  let col = Number(this.getAttribute("col"));
  console.log(thinking);
  if (thinking || gameOver || gameBoard[row][col] !== "-") return;

  this.innerHTML = "x";
  gameBoard[row][col] = "x";
  if (checkWin("x")) {
    gameOver = true;
    document.getElementById("winner").innerHTML = "human wins";
    return;
  }

  thinking = true
  document.getElementById('turn').innerHTML = 'thinking'

  setTimeout(() => {
    let pick = botPick(gameBoard, difficulty);

    console.log(pick);
    board.childNodes[pick.row].childNodes[pick.col].innerHTML = "o";
    gameBoard[pick.row][pick.col] = "o";
    board.childNodes[prev.row].childNodes[prev.col].style.background = "white";
    board.childNodes[pick.row].childNodes[pick.col].style.background = "pink";
    prev = pick;

    thinking = false
    document.getElementById('turn').innerHTML = 'your turn'

    if (checkWin("o")) {
      gameOver = true;
      document.getElementById("winner").innerHTML = "bot wins";
    }
  }, 100);
});

$(document.body).on("click", "#eval", function () {
  console.log("hello");
  console.log(evaluateBoard(gameBoard));
});

$(document.body).on("click", "#empty", function () {
  console.log(getEmptySquaresBFS(gameBoard));
});
