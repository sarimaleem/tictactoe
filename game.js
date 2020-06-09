let board = document.getElementById("board");
createBoard();

const queryString = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
const username = queryString.name;
const room = queryString.room;

var socket = io();
socket.emit("joinRoom", room);

let gameReady = false;
let gameOver = false;
let playerToken = queryString.playerToken;
console.log(playerToken);

socket.on("move", function (data) {
  let s = getSquare(data.row, data.col);

  if (data.turn === "X") {
    s.innerHTML = "X";
  } else {
    s.innerHTML = "O";
  }

  if(checkVictory(data.row, data.col, playerToken)) {
    socket.emit('win', {playerToken, room})
  }

});

socket.on("win", function (data) {
  document.getElementById("winner").innerHTML = 'Player ' + data.playerToken + " won";
});

socket.on("joinRoom", (data) => {
  if (data.gameReady) {
    gameReady = true;
    document.getElementById("waiting").innerHTML = "game start";
  }
});

$(document.body).on("click", ".square", function () {
  if (!gameReady || gameOver) return;
  if (this.innerHTML !== "") return;

  data = { row: this.row, col: this.col, room, playerToken };
  socket.emit("move", data);
});

function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < 8; i++) {
    let row = document.createElement("div");
    row.className = "row";
    for (let j = 0; j < 8; j++) {
      let square = document.createElement("div");
      square.className = "square";
      square.row = i;
      square.col = j;
      row.appendChild(square);
    }
    board.appendChild(row);
  }
}

function getSquareContent(row, col) {
  return board.childNodes[row].childNodes[col].innerHTML;
}

function getSquare(row, col) {
  return board.childNodes[row].childNodes[col];
}

function checkVictory(row, col, playerToken) {
  //check vertical

  if(getSquareContent(row, col) !== playerToken) {
    return false;
  }

  let cnt = 1,
    r = row - 1,
    c = col;
  while (r >= 0 && getSquareContent(r, c) === playerToken) {
    cnt++;
    r--;
  }
  r = row + 1;
  c = col;
  while (r <= 7 && getSquareContent(r, c) === playerToken) {
    cnt++;
    r++;
  }

  if (cnt >= 4) return true;

  //check horizontal
  cnt = 1;
  r = row;
  c = col - 1;
  while (c >= 0 && getSquareContent(r, c) === playerToken) {
    cnt++;
    c--;
  }
  r = row;
  c = col + 1;
  while (c <= 7 && getSquareContent(r, c) === playerToken) {
    cnt++;
    c++;
  }

  if (cnt >= 4) return true;

  //check diagonal
  cnt = 1;
  r = row - 1;
  c = col - 1;
  while (r >= 0 && c >= 0 && getSquareContent(r, c) === playerToken) {
    r--;
    c--;
    cnt++;
  }
  r = row + 1;
  c = col + 1;

  while (r <= 7 && c <= 7 && getSquareContent(r, c) === playerToken) {
    r++;
    c++;
    cnt++;
  }

  if (cnt >= 4) return true;
  //check anti diagonal
  cnt = 1;
  r = row - 1;
  c = col + 1;
  while (r >= 0 && c <= 7 && getSquareContent(r, c) === playerToken) {
    r--;
    c++;
    cnt++;
  }
  r = row + 1;
  c = col - 1;

  while (r <= 7 && c >= 0 && getSquareContent(r, c) === playerToken) {
    r++;
    c--;
    cnt++;
  }

  if (cnt >= 4) return true;

  return false;
}
