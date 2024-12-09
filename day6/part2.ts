import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
)).split("\n");

let result = 0;

let [x, y] = [0, 0];
const grid = new Map<string, string>();

lines.forEach((row, i) => {
  row.split("").forEach((col, j) => {
    grid.set([i, j].join(","), col);
    if (col == "^") {
      [x, y] = [i, j];
    }
  });
});

const walk = (x: number, y: number, grid: Map<string, string>) => {
  const route = new Array<string>();
  const visited = new Map<string, Set<string>>();
  const directions = ["N", "E", "S", "W"];
  let directionId = 0;
  while (grid.has([x, y].join(","))) {
    const direction = directions[directionId % 4];
    if (visited.has([x, y].join(","))) {
      const previousVisits = visited.get([x, y].join(","));
      if (previousVisits?.has(direction)) {
        return route;
      } else {
        previousVisits?.add(direction);
      }
    } else {
      visited.set([x, y].join(","), new Set([direction]));
    }
    let [i, j] = [0, 0];
    if (direction === "N") {
      [i, j] = [x - 1, y];
    } else if (direction === "E") {
      [i, j] = [x, y + 1];
    } else if (direction === "S") {
      [i, j] = [x + 1, y];
    } else {
      [i, j] = [x, y - 1];
    }

    const nextPos = grid.get([i, j].join(","));
    if (nextPos === "#") {
      directionId += 1;
    } else {
      [x, y] = [i, j];
      route.push([i, j].join(","));
    }
  }
  return route;
};

const route = walk(x, y, grid);
for (const pos of new Set(route)) {
  const newGrid = new Map(grid);
  newGrid.set(pos, "#");
  const newPath = walk(x, y, newGrid);
  if (grid.has(newPath[newPath.length - 1])) {
    result += 1;
  }
}

console.log(result);
