import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
)).split("\n");

const TARGET_CAHR = "^";

const board: string[][] = [];
let cursorX: number = -1;
let cursorY: number = -1;
for (let i = 0; i < lines.length; i++) {
  const row = lines[i].split("");
  board.push(row);
  const targetIdx = row.indexOf(TARGET_CAHR);
  if (targetIdx !== -1) {
    cursorX = targetIdx;
    cursorY = i;
  }
}

let direction: "up" | "down" | "left" | "right" = "up";
const footPrints = new Set<string>();
let searchCursorX = cursorX;
let searchCursorY = cursorY;

while (
  searchCursorX >= 0 && searchCursorX < board[0].length && searchCursorY >= 0 &&
  searchCursorY < board.length
) {
  if (direction === "up") {
    while (true) {
      footPrints.add(`${searchCursorX},${searchCursorY}`);
      if (searchCursorY - 1 < 0) {
        searchCursorY--;
        break;
      }
      if (board[searchCursorY - 1][searchCursorX] === "#") {
        break;
      }
      searchCursorY--;
    }
    direction = "right";
  } else if (direction === "right") {
    while (true) {
      footPrints.add(`${searchCursorX},${searchCursorY}`);
      if (searchCursorX + 1 >= board[0].length) {
        searchCursorX++;
        break;
      }
      if (board[searchCursorY][searchCursorX + 1] === "#") {
        break;
      }
      searchCursorX++;
    }
    direction = "down";
  } else if (direction === "down") {
    while (true) {
      footPrints.add(`${searchCursorX},${searchCursorY}`);
      if (searchCursorY + 1 >= board.length) {
        searchCursorY++;
        break;
      }
      if (board[searchCursorY + 1][searchCursorX] === "#") {
        break;
      }
      searchCursorY++;
    }
    direction = "left";
  } else if (direction === "left") {
    while (true) {
      footPrints.add(`${searchCursorX},${searchCursorY}`);
      if (searchCursorX - 1 < 0) {
        searchCursorX--;
        break;
      }
      if (board[searchCursorY][searchCursorX - 1] === "#") {
        break;
      }
      searchCursorX--;
    }
    direction = "up";
  }
}

console.log(footPrints.size);
