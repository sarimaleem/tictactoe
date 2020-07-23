import { evaluateBoard } from "./eval.js";

let counter = 0;
export function botPick(gameBoard, difficulty) {
  let move = minimax(
    gameBoard,
    true,
    0,
    Number.NEGATIVE_INFINITY,
    Number.POSITIVE_INFINITY, 
    difficulty
  );
  console.log(counter);
  counter = 0;
  return move;
}

export function getEmptySquares(gameBoard) {
  let emptySquares = [];
  for (let i = 0; i < gameBoard.length; i++) {
    for (let j = 0; j < gameBoard[0].length; j++) {
      if (gameBoard[i][j] === "-") {
        emptySquares.push({ row: i, col: j });
      }
    }
  }
  return emptySquares;
}

//gets squares around pieces first through breadth first search
export function getEmptySquaresBFS(gameBoard) {
  let size = gameBoard.length;
  let emptySquares = [];
  let queue = [];
  let visited = Array.from(Array(size), () => new Array(size).fill(false));
  let dx = [1, -1, 0, 0];
  let dy = [0, 0, -1, 1];

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (gameBoard[i][j] === "x" || gameBoard[i][j] === "o") {
        visited[i][j] = true;
        for (let k = 0; k < 4; k++) {
          let x = i + dx[k];
          let y = j + dy[k];
          if (x > -1 && x < size && y > -1 && y < size) {
            if (gameBoard[x][y] === '-' && !visited[x][y]) {
              queue.push({ row: x, col: y });
              visited[x][y] = true;
            }
          }
        }
      }
    }
  }

  while (!(queue.length === 0)) {
    let node = queue.shift();
    emptySquares.push(node);

    for (let k = 0; k < 4; k++) {
      let x = node.row + dx[k];
      let y = node.col + dy[k];
      if (x > -1 && x < size && y > -1 && y < size) {
        if (!visited[x][y]) {
          queue.push({ row: x, col: y });
          visited[x][y] = true;
        }
      }
    }
  }


  return emptySquares
}

function minimax(gameBoard, AI, step, alpha, beta, depth) {
  let spots = getEmptySquaresBFS(gameBoard);

  if (step === depth) {
    counter++;
    return { score: evaluateBoard(gameBoard) };
  }

  if (AI) {
    let bestMove = { score: Number.NEGATIVE_INFINITY };
    for (let i = 0; i < spots.length; i++) {
      let move = spots[i];
      gameBoard[move.row][move.col] = "o";
      let result = minimax(gameBoard, false, step + 1, alpha, beta, depth);
      move.score = result.score;
      gameBoard[move.row][move.col] = "-";

      if (move.score > bestMove.score) {
        bestMove = move;
      }

      alpha = Math.max(bestMove.score, alpha);
      if (beta <= alpha) {
        break;
      }
    }

    return bestMove;
  } else {
    let bestMove = { score: Number.POSITIVE_INFINITY };
    for (let i = 0; i < spots.length; i++) {
      let move = spots[i];
      gameBoard[move.row][move.col] = "x";
      let result = minimax(gameBoard, true, step + 1, alpha, beta, depth);
      move.score = result.score;
      gameBoard[move.row][move.col] = "-";

      if (move.score < bestMove.score) {
        bestMove = move;
      }

      beta = Math.min(bestMove.score, beta);
      if (beta <= alpha) {
        break;
      }
    }

    return bestMove;
  }
}

function checkWin(gameBoard, player) {
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
