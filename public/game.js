let board = document.getElementById("board");
createBoard();

const queryString = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
const username = queryString.name;
const room = queryString.room;

document.getElementById('room').innerHTML = 'Your room id is: ' + room;

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

  if(data.turn === playerToken) { 
    document.getElementById('turn').innerHTML = 'Opponents turn'
  } else { 
    document.getElementById('turn').innerHTML = 'Your Turn'
  }

  let windata = checkVictory(data.row, data.col, playerToken)
  if(windata.win) {
    socket.emit('win', {playerToken, room, wincombo: windata.wincombo})
  }
});

socket.on("win", function (data) {
  document.getElementById("winner").innerHTML =
    "Player " + data.playerToken + " won";

  wincombo = data.wincombo;

  for(let i = 0; i < wincombo.length; i++) {
    let r = wincombo[i][0]
    let c = wincombo[i][1]
    let s = getSquare(r, c);
    s.style.color = 'red'
  }

  gameOver = true;
});

socket.on("joinRoom", (data) => {
  if (data.gameReady) {
    gameReady = true;
    document.getElementById("waiting").innerHTML = "Game Start | Get 5 in a Row to Win";
    document.getElementById('waiting').style.color = 'green'
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
  for (let i = 0; i < 15; i++) {
    let row = document.createElement("div");
    row.className = "row";
    for (let j = 0; j < 15; j++) {
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
  if (getSquareContent(row, col) !== playerToken) {
    return {win: false};
  }
  
  let wincombo = [[row, col]]
  let cnt = 1,
    r = row - 1,
    c = col;
  while (r >= 0 && getSquareContent(r, c) === playerToken) {
    wincombo.push([r, c])
    cnt++;
    r--;
  }
  r = row + 1;
  c = col;
  while (r < 15 && getSquareContent(r, c) === playerToken) {
    wincombo.push([r, c])
    cnt++;
    r++;
  }

  if (cnt >= 5) return {win: true, wincombo};
  wincombo = [[row, col]]

  //check horizontal
  cnt = 1;
  r = row;
  c = col - 1;
  while (c >= 0 && getSquareContent(r, c) === playerToken) {
    wincombo.push([r, c])
    cnt++;
    c--;
  }
  r = row;
  c = col + 1;
  while (c < 15 && getSquareContent(r, c) === playerToken) {
    wincombo.push([r, c])
    cnt++;
    c++;
  }

  if (cnt >= 5) return {win: true, wincombo};
  wincombo = [[row, col]]
  //check diagonal
  cnt = 1;
  r = row - 1;
  c = col - 1;
  while (r >= 0 && c >= 0 && getSquareContent(r, c) === playerToken) {
    wincombo.push([r, c])
    r--;
    c--;
    cnt++;
  }
  r = row + 1;
  c = col + 1;

  while (r < 15 && c < 15 && getSquareContent(r, c) === playerToken) {
    wincombo.push([r, c])
    r++;
    c++;
    cnt++;
  }

  if (cnt >= 5) return {win: true, wincombo};
  wincombo = [[row, col]]
  //check anti diagonal
  cnt = 1;
  r = row - 1;
  c = col + 1;
  while (r >= 0 && c < 15 && getSquareContent(r, c) === playerToken) {
    wincombo.push([r, c])
    r--;
    c++;
    cnt++;
  }
  r = row + 1;
  c = col - 1;

  while (r < 15 && c >= 0 && getSquareContent(r, c) === playerToken) {
    wincombo.push([r, c])
    r++;
    c--;
    cnt++;
  }

  if (cnt >= 5) return {win: true, wincombo};

  return {win: false};
}
