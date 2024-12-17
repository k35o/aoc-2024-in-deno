import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
)).replace(/\r/g, "")
  .split("\n\n")
  .map((group) => group.split("\n"));

const DIRECTIONS = {
  ">": [0, 1],
  v: [1, 0],
  "<": [0, -1],
  "^": [-1, 0],
} as const satisfies Record<string, [number, number]>;

function canMove(
  map: string[][],
  position: [number, number],
  direction: [number, number],
): undefined | boolean {
  let [row, col] = position;
  const [directionRow, directionCol] = direction;
  const isHorizontalMove = directionRow === 0;

  if (isHorizontalMove) {
    while ("O[]".includes(map[row][col])) {
      col += directionCol;
    }

    return map[row][col] === ".";
  } else {
    if (map[row][col] === ".") {
      return true;
    } else if (map[row][col] === "#") {
      return false;
    } else if (map[row][col] === "]") {
      return canMove(map, [row, col - 1], direction);
    } else if (map[row][col] === "[") {
      return (
        canMove(map, [row + directionRow, col], direction) &&
        (map[row + directionRow][col] === "[" ||
          canMove(map, [row + directionRow, col + 1], direction))
      );
    }
  }
}

const moveBox = (
  map: string[][],
  position: [number, number],
  direction: [number, number],
) => {
  let [row, col] = position;
  const [directionRow, directionCol] = direction;
  const isHorizontalMove = directionRow === 0;

  if (isHorizontalMove) {
    const currentCol = col;
    while ("O[]".includes(map[row][col])) {
      col += directionCol;
    }

    for (; col != currentCol; col -= directionCol) {
      map[row][col] = map[row][col - directionCol];
    }
  } else {
    if (map[row][col] === "]") {
      moveBox(map, [row, col - 1], direction);
    } else if (map[row][col] === "[") {
      moveBox(map, [row + directionRow, col], direction);
      moveBox(map, [row + directionRow, col + 1], direction);

      map[row + directionRow][col] = "[";
      map[row + directionRow][col + 1] = "]";
      map[row][col] = map[row][col + 1] = ".";
    }
  }
};

const moveRobot = (
  map: string[][],
  position: [number, number],
  direction: [number, number],
) => {
  const [row, col] = position;
  const [directionRow, directionCol] = direction;

  map[row][col] = "@";
  map[row - directionRow][col - directionCol] = ".";
};

const tryMove = (
  map: string[][],
  position: [number, number],
  direction: [number, number],
): [number, number] => {
  let [row, col] = position;
  const [directionRow, directionCol] = direction;

  if (canMove(map, [row + directionRow, col + directionCol], direction)) {
    moveBox(map, [row + directionRow, col + directionCol], direction);
    moveRobot(map, [row + directionRow, col + directionCol], direction);

    row += directionRow;
    col += directionCol;
  }

  return [row, col];
};

const map = lines[0].map((line) => {
  line = line.replace(/#/g, "##");
  line = line.replace(/O/g, "[]");
  line = line.replace(/\./g, "..");
  line = line.replace(/@/g, "@.");

  return line.split("");
});

const movements = lines[1].join("").split("");

let start: [number, number] = [0, 0];
for (let row = 0; row < map.length; row++) {
  for (let col = 0; col < map[0].length; col++) {
    if (map[row][col] === "@") {
      start = [row, col];
    }
  }
}

let position = start;
for (const movement of movements) {
  position = tryMove(
    map,
    position,
    DIRECTIONS[movement as keyof typeof DIRECTIONS],
  );
}

let sum = 0;

for (let row = 0; row < map.length; row++) {
  for (let col = 0; col < map[0].length; col++) {
    if ("O[".includes(map[row][col])) {
      sum += 100 * row + col;
    }
  }
}

console.log(sum);
