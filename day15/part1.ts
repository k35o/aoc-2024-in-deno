import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
)).split("\n");

const board: string[][] = [];
const operations: string[] = [];

let isOperation = false;
let position = [0, 0];
for (let i = 0; i < lines.length; i++) {
  if (lines[i] === "") {
    isOperation = true;
    continue;
  }

  if (!isOperation) {
    board.push([]);
    for (let j = 0; j < lines[i].length; j++) {
      if (lines[i][j] === "@") {
        position = [board.length - 1, j];
      }
      board[board.length - 1].push(lines[i][j]);
    }
  } else {
    for (let j = 0; j < lines[i].length; j++) {
      operations.push(lines[i][j]);
    }
  }
}

for (const operation of operations) {
  board[position[0]][position[1]] = ".";
  if (operation === "<") {
    if (board[position[0]][position[1] - 1] === "#") {
      board[position[0]][position[1]] = "@";
      continue;
    }
    if (board[position[0]][position[1] - 1] === "O") {
      let hasNext = false;
      let nextPositionX = position[1] - 1;
      while (board[position[0]][nextPositionX] !== "#") {
        if (board[position[0]][nextPositionX] === ".") {
          hasNext = true;
          board[position[0]][nextPositionX] = "O";
          board[position[0]][position[1] - 1] = ".";
          break;
        }
        nextPositionX--;
      }
      if (!hasNext) {
        board[position[0]][position[1]] = "@";
        continue;
      }
    }
    position = [position[0], position[1] - 1];
  }
  if (operation === "^") {
    if (board[position[0] - 1][position[1]] === "#") {
      board[position[0]][position[1]] = "@";
      continue;
    }
    if (board[position[0] - 1][position[1]] === "O") {
      let hasNext = false;
      let nextPositionY = position[0] - 1;
      while (board[nextPositionY][position[1]] !== "#") {
        if (board[nextPositionY][position[1]] === ".") {
          hasNext = true;
          board[nextPositionY][position[1]] = "O";
          board[position[0] - 1][position[1]] = ".";
          break;
        }
        nextPositionY--;
      }
      if (!hasNext) {
        board[position[0]][position[1]] = "@";
        continue;
      }
    }
    position = [position[0] - 1, position[1]];
  }
  if (operation === ">") {
    if (board[position[0]][position[1] + 1] === "#") {
      board[position[0]][position[1]] = "@";
      continue;
    }
    if (board[position[0]][position[1] + 1] === "O") {
      let hasNext = false;
      let nextPositionX = position[1] + 1;
      while (board[position[0]][nextPositionX] !== "#") {
        if (board[position[0]][nextPositionX] === ".") {
          hasNext = true;
          board[position[0]][nextPositionX] = "O";
          board[position[0]][position[1] + 1] = ".";
          break;
        }
        nextPositionX++;
      }
      if (!hasNext) {
        board[position[0]][position[1]] = "@";
        continue;
      }
    }
    position = [position[0], position[1] + 1];
  }
  if (operation === "v") {
    if (board[position[0] + 1][position[1]] === "#") {
      board[position[0]][position[1]] = "@";
      continue;
    }
    if (board[position[0] + 1][position[1]] === "O") {
      let hasNext = false;
      let nextPositionY = position[0] + 1;
      while (board[nextPositionY][position[1]] !== "#") {
        if (board[nextPositionY][position[1]] === ".") {
          hasNext = true;
          board[nextPositionY][position[1]] = "O";
          board[position[0] + 1][position[1]] = ".";
          break;
        }
        nextPositionY++;
      }
      if (!hasNext) {
        board[position[0]][position[1]] = "@";
        continue;
      }
    }
    position = [position[0] + 1, position[1]];
  }
  board[position[0]][position[1]] = "@";
}

let result = 0;
for (let i = 0; i < board.length; i++) {
  for (let j = 0; j < board[i].length; j++) {
    if (board[i][j] === "O") {
      result += (i * 100) + j;
    }
  }
}

console.log(result);
