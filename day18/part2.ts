import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
)).split("\n")
  .map((line) => line.split(",").map(Number)) as [number, number][];

const LEN = 71;
const START_POSITION = [0, 0] as const;
const END_POSITION = [LEN - 1, LEN - 1] as const;

const isOk = (lines: [number, number][], step: number) => {
  const map: string[][] = [];
  for (let i = 0; i < LEN; i++) {
    map.push([]);
    for (let j = 0; j < LEN; j++) {
      const isWall = lines
        .slice(0, step)
        .some((line) => line[0] === i && line[1] === j);
      if (isWall) {
        map[map.length - 1].push("#");
      } else {
        map[map.length - 1].push(".");
      }
    }
  }

  let result = 0;
  const steps: Readonly<[number, number]>[] = [START_POSITION];
  const visited = new Set(`${START_POSITION[0]},${START_POSITION[1]}`);

  let isGoal = false;
  while (steps.length) {
    const stepsLength = steps.length;
    for (let i = 0; i < stepsLength; i++) {
      const [x, y] = steps.shift()!;

      if (x === END_POSITION[0] && y === END_POSITION[1]) {
        isGoal = true;
        break;
      }

      if (!isOutOfBoundary(x + 1, y) && map[x + 1][y] !== "#" && !visited.has(`${x + 1},${y}`)) {
        steps.push([x + 1, y]);
        visited.add(`${x + 1},${y}`);
      }
      if (!isOutOfBoundary(x, y + 1) && map[x][y + 1] !== "#" && !visited.has(`${x},${y + 1}`)) {
        steps.push([x, y + 1]);
        visited.add(`${x},${y + 1}`);
      }
      if (!isOutOfBoundary(x - 1, y) && map[x - 1][y] !== "#" && !visited.has(`${x - 1},${y}`)) {
        steps.push([x - 1, y]);
        visited.add(`${x - 1},${y}`);
      }
      if (!isOutOfBoundary(x, y - 1) && map[x][y - 1] !== "#" && !visited.has(`${x},${y - 1}`)) {
        steps.push([x, y - 1]);
        visited.add(`${x},${y - 1}`);
      }
    }

    if (isGoal) {
      break;
    }
    result++;
  }

  return isGoal;

  function isOutOfBoundary(x: number, y: number) {
    return x < 0 || x >= LEN || y < 0 || y >= LEN;
  }
};

// isOk(lines, 1024) === true
let left = 1024;
// isOk(lines, lines.length) === false
let right = lines.length - 1;

while (true) {
  const mid = Math.floor((left + right) / 2);
  if (isOk(lines, mid)) {
    left = mid;
  } else {
    right = mid;
  }
  if (left + 1 === right) {
    break;
  }
}

console.log(lines[left].join(","));
