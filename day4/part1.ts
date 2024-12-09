import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
)).split("\n");

const XMAS = "XMAS";
const REVERSE_XMAS = "SAMX";

let result = 0;

// horizontal
result += countHorizontal(lines, XMAS);
result += countHorizontal(lines, REVERSE_XMAS);

// vertical
result += countVertical(lines, XMAS);
result += countVertical(lines, REVERSE_XMAS);

// diagonal right
result += countDiagonalRight(lines, XMAS);
result += countDiagonalRight(lines, REVERSE_XMAS);

// diagonal left
result += countDiagonalLeft(lines, XMAS);
result += countDiagonalLeft(lines, REVERSE_XMAS);

console.log(result);

function countHorizontal(grid: string[], substring: string) {
  let count = 0;

  for (const row of grid) {
    count += row.split(substring).length - 1;
  }

  return count;
}

function countVertical(grid: string[], substring: string) {
  const numRows = grid.length;
  const numCols = grid[0].length;
  let count = 0;

  for (let col = 0; col < numCols; col++) {
    let columnString = "";
    for (let row = 0; row < numRows; row++) {
      columnString += grid[row][col];
    }
    count += columnString.split(substring).length - 1;
  }

  return count;
}

function countDiagonalRight(grid: string[], substring: string) {
  const numRows = grid.length;
  const numCols = grid[0].length;
  let count = 0;

  // 右下がりの斜めを作る
  for (let startRow = 0; startRow < numRows; startRow++) {
    let diagonalString = "";
    for (
      let row = startRow, col = 0;
      row < numRows && col < numCols;
      row++, col++
    ) {
      diagonalString += grid[row][col];
    }
    count += diagonalString.split(substring).length - 1;
  }

  for (let startCol = 1; startCol < numCols; startCol++) {
    let diagonalString = "";
    for (
      let col = startCol, row = 0;
      col < numCols && row < numRows;
      col++, row++
    ) {
      diagonalString += grid[row][col];
    }
    count += diagonalString.split(substring).length - 1;
  }

  return count;
}

function countDiagonalLeft(grid: string[], substring: string) {
  const numRows = grid.length;
  const numCols = grid[0].length;
  let count = 0;

  // 左下がりの斜めを作る
  for (let startRow = 0; startRow < numRows; startRow++) {
    let diagonalString = "";
    for (
      let row = startRow, col = numCols - 1;
      row < numRows && col >= 0;
      row++, col--
    ) {
      diagonalString += grid[row][col];
    }
    count += diagonalString.split(substring).length - 1;
  }

  for (let startCol = numCols - 2; startCol >= 0; startCol--) {
    let diagonalString = "";
    for (let col = startCol, row = 0; col >= 0 && row < numRows; col--, row++) {
      diagonalString += grid[row][col];
    }
    count += diagonalString.split(substring).length - 1;
  }

  return count;
}
