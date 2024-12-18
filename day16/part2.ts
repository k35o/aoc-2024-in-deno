import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

type Direction = "right" | "bottom" | "left" | "top";

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
)).split("\n");

const map = lines.map((line) => line.split(""));

let startPositions: [number, number] = [0, 0];

for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[y].length; x++) {
    if (map[y][x] === "S") {
      startPositions = [y, x];
    }
  }
}

const points: number[] = [];
const pointMap: Record<string, number> = {};
let minMap = new Set<string>();
const re = (
  position: [number, number],
  point = 0,
  pastVisited: string[] = [],
  lastDirection?: Direction,
) => {
  const [y, x] = position;
  const current = map[y][x];

  if (Math.min(...points) < point) {
    return;
  }
  if (pointMap[`${y},${x}`] && pointMap[`${y},${x}`] < point - 1001) {
    return;
  }

  if (pastVisited.includes(`${y},${x}`)) {
    return;
  }
  if (current === "E") {
    if (Math.min(...points) > point) {
      minMap = new Set<string>(pastVisited);
    } else if (Math.min(...points) === point) {
      minMap = new Set<string>([...minMap, ...pastVisited]);
    }
    points.push(point);
    return;
  }

  if (current === "#") {
    return;
  }

  pastVisited.push(`${y},${x}`);
  if (pointMap[`${y},${x}`]) {
    pointMap[`${y},${x}`] = Math.min(pointMap[`${y},${x}`], point);
  } else {
    pointMap[`${y},${x}`] = point;
  }
  if (lastDirection === "right") {
    re([y + 1, x], point + 1001, [...pastVisited], "bottom");
    re([y, x + 1], point + 1, [...pastVisited], "right");
    re([y - 1, x], point + 1001, [...pastVisited], "top");
  } else if (lastDirection === "bottom") {
    re([y, x + 1], point + 1001, [...pastVisited], "right");
    re([y + 1, x], point + 1, [...pastVisited], "bottom");
    re([y, x - 1], point + 1001, [...pastVisited], "left");
  } else if (lastDirection === "left") {
    re([y + 1, x], point + 1001, [...pastVisited], "bottom");
    re([y, x - 1], point + 1, [...pastVisited], "left");
    re([y - 1, x], point + 1001, [...pastVisited], "top");
  } else if (lastDirection === "top") {
    re([y, x + 1], point + 1001, [...pastVisited], "right");
    re([y - 1, x], point + 1, [...pastVisited], "top");
    re([y, x - 1], point + 1001, [...pastVisited], "left");
  } else {
    re([y + 1, x], point + 1001, [...pastVisited], "bottom");
    re([y, x + 1], point + 1001, [...pastVisited], "right");
    re([y - 1, x], point + 1001, [...pastVisited], "top");
    re([y, x - 1], point + 1001, [...pastVisited], "left");
  }
};

re(startPositions);

console.log(minMap.size + 1);
