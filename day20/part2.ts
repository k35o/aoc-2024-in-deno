import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
)).split("\n");

const fields: string[][] = [];
let startPosition: [number, number] = [0, 0];

for (let i = 0; i < lines.length; i++) {
  fields.push([]);
  for (let j = 0; j < lines[i].length; j++) {
    fields[i].push(lines[i][j]);
    if (lines[i][j] === "S") {
      startPosition = [i, j];
    }
  }
}

type Direction = "top" | "left" | "bottom" | "right";

const possiblePosition = (
  position: [number, number, ...Direction[]],
  pastDirection?: Direction,
) => {
  const [x, y] = position;
  const routes: [number, number, Direction][] = [];
  if (x - 1 >= 0 && fields[x - 1][y] !== "#" && pastDirection !== "bottom") {
    routes.push([x - 1, y, "top"]);
  }
  if (
    x + 1 < fields.length && fields[x + 1][y] !== "#" && pastDirection !== "top"
  ) {
    routes.push([x + 1, y, "bottom"]);
  }
  if (
    y + 1 < fields[x].length && fields[x][y + 1] !== "#" &&
    pastDirection !== "left"
  ) {
    routes.push([x, y + 1, "right"]);
  }
  if (y - 1 >= 0 && fields[x][y - 1] !== "#" && pastDirection !== "right") {
    routes.push([x, y - 1, "left"]);
  }
  return routes;
};

const getNextPositions = (
  position: [number, number],
) => {
  const [x, y] = position;
  const routes: [number, number, Direction][] = [];
  if (x - 1 >= 0) {
    routes.push([x - 1, y, "top"]);
  }
  if (x + 1 < fields.length) {
    routes.push([x + 1, y, "bottom"]);
  }
  if (y + 1 < fields[x].length) {
    routes.push([x, y + 1, "right"]);
  }
  if (y - 1 >= 0) {
    routes.push([x, y - 1, "left"]);
  }
  return routes;
};

const route = new Map<string, number>();
route.set(`${startPosition[0]},${startPosition[1]}`, 0);
let nextPosition = possiblePosition(startPosition)[0];
let count = 0;
while (nextPosition) {
  route.set(`${nextPosition[0]},${nextPosition[1]}`, ++count);
  nextPosition = possiblePosition(nextPosition, nextPosition[2])[0];
}

const MAX_CHEAT_COUNT = 20;

const result = new Map<number, number>();
route.entries().forEach(([key, value]) => {
  const visited = new Set<string>();
  let toVisit = new Set([key]);
  const candidateCheats = new Map<string, number>();
  for (let count = 1; count <= MAX_CHEAT_COUNT; count++) {
    const nextToVisit = new Set<string>();
    for (const position of toVisit) {
      visited.add(position);
      const nextPositions = getNextPositions(
        position.split(",").map(Number) as [number, number],
      ).filter(([x, y]) => !visited.has(`${x},${y}`));
      for (const nextPosition of nextPositions) {
        nextToVisit.add(`${nextPosition[0]},${nextPosition[1]}`);
        if (route.has(`${nextPosition[0]},${nextPosition[1]}`)) {
          const countSaved =
            (route.get(`${nextPosition[0]},${nextPosition[1]}`) ?? 0) - value -
            count;
          if (countSaved > 0) {
            candidateCheats.set(
              `${nextPosition[0]},${nextPosition[1]}`,
              countSaved,
            );
          }
        }
      }
    }
    toVisit = nextToVisit;
  }
  for (const count of candidateCheats.values()) {
    result.set(count, (result.get(count) ?? 0) + 1);
  }
});

console.log(
  result
    .entries()
    .filter(([k]) => k > 99)
    .reduce((acc, [_, v]) => acc + v, 0),
);
