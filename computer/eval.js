import { scorePattern } from "./pattern.js";

export function evaluateBoard(gameBoard) {
  let length = gameBoard.length;
  let score = 0;
  //evaluate row wise
  for (let row = 0; row < length; row++) {
    for (let col = 0; col <= length - 5; col++) {
      let pattern =
        gameBoard[row][col] +
        gameBoard[row][col + 1] +
        gameBoard[row][col + 2] +
        gameBoard[row][col + 3] +
        gameBoard[row][col + 4];

      score += scorePattern(pattern); //take care of the length 5 strings
      if (col === length - 5) {
        continue;
      }
      pattern += gameBoard[row][col + 5];
      score += scorePattern(pattern); //take care of the length 6 strings
    }
  }

  //evaluate column wise
  for (let col = 0; col < length; col++) {
    for (let row = 0; row <= length - 5; row++) {
      let pattern =
        gameBoard[row][col] +
        gameBoard[row + 1][col] +
        gameBoard[row + 2][col] +
        gameBoard[row + 3][col] +
        gameBoard[row + 4][col];

      score += scorePattern(pattern); //take care of the length 5 strings
      if (row === length - 5) {
        continue;
      }
      pattern += gameBoard[row + 5][col];
      score += scorePattern(pattern); //take care of the length 6 strings
    }
  }

  //evaluate diagonal: this is gonna be a little tough ugh

  for (let col = 0; col <= length - 5; col++) {
    for (let row = 0; row <= length - 5; row++) {
      let pattern =
        gameBoard[row][col] +
        gameBoard[row + 1][col + 1] +
        gameBoard[row + 2][col + 2] +
        gameBoard[row + 3][col + 3] +
        gameBoard[row + 4][col + 4];

      score += scorePattern(pattern);

      if (row === length - 5 || col === length - 5) {
        continue;
      }
      pattern += gameBoard[row + 5][col + 5];
      score += scorePattern(pattern);
    }
  }
  

  //time to evaluate the antidiagonal
  for (let col = 0; col < length - 4; col++) {
    for (let row = 4; row < length; row++) {
      let pattern =
        gameBoard[row][col] +
        gameBoard[row - 1][col + 1] +
        gameBoard[row - 2][col + 2] +
        gameBoard[row - 3][col + 3] +
        gameBoard[row - 4][col + 4];

      score += scorePattern(pattern);
      if (row === 4 || col === length - 5) {
        continue;
      }
      pattern += gameBoard[row - 5][col + 5];
      score += scorePattern(pattern);
    }
  }


  return score;
}
