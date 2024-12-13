import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
)).split("\n");

const boards: number[][] = [];
const endPositions: [number, number][] = [];
for (let i = 0; i < lines.length; i++) {
  const board: number[] = [];
  for (let j = 0; j < lines[i].length; j++) {
    if (lines[i][j] === "9") {
      endPositions.push([i, j]);
    }
    board.push(Number(lines[i][j]));
  }
  boards.push(board);
}

let result = 0;
for (const pos of endPositions) {
  const prevVisited = new Set<string>();

  const searchNextPosition = (
    boards: number[][],
    pos: [number, number],
  ): number => {
    if (boards[pos[0]][pos[1]] === 0) {
      if (prevVisited.has(`${pos[0]}-${pos[1]}`)) {
        return 0;
      }
      prevVisited.add(`${pos[0]}-${pos[1]}`);
      return 1;
    }
    let result = 0;
    const current = boards[pos[0]][pos[1]];
    if (pos[0] > 0 && boards[pos[0] - 1][pos[1]] === current - 1) {
      result += searchNextPosition(boards, [pos[0] - 1, pos[1]]);
    }
    if (
      pos[0] < boards.length - 1 && boards[pos[0] + 1][pos[1]] === current - 1
    ) {
      result += searchNextPosition(boards, [pos[0] + 1, pos[1]]);
    }
    if (pos[1] > 0 && boards[pos[0]][pos[1] - 1] === current - 1) {
      result += searchNextPosition(boards, [pos[0], pos[1] - 1]);
    }
    if (
      pos[1] < boards[0].length - 1 &&
      boards[pos[0]][pos[1] + 1] === current - 1
    ) {
      result += searchNextPosition(boards, [pos[0], pos[1] + 1]);
    }
    return result;
  };

  result += searchNextPosition(boards, pos);
}

console.log(result);
