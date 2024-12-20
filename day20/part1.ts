import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
)).split("\n");

const fields: string[][] = [];
let startPosition = [0, 0];
let endPosition = [0, 0];

for (let i = 0; i < lines.length; i++) {
  fields.push([]);
  for (let j = 0; j < lines[i].length; j++) {
    fields[i].push(lines[i][j]);
    if (lines[i][j] === "S") {
      startPosition = [i, j];
    } else if (lines[i][j] === "E") {
      endPosition = [i, j];
    }
  }
}

const result = new Map<number, number>();

for (let i = 0; i < fields.length; i++) {
  for (let j = 0; j < fields[i].length; j++) {
    const cloneFields = structuredClone(fields);
    if (fields[i][j] === "S" || fields[i][j] === "#") {
      if (fields[i][j] === "#") {
        cloneFields[i][j] = ".";
      }
      const visited = new Set<string>();
      visited.add(`${startPosition[0]},${startPosition[1]}`);

      const queue: [[number, number], number][] = [[[
        startPosition[0],
        startPosition[1],
      ], 0]];

      while (queue.length > 0) {
        const [position, step] = queue.shift()!;
        if (position[0] === endPosition[0] && position[1] === endPosition[1]) {
          result.set(step, (result.get(step) ?? 0) + 1);
          break;
        }

        for (const [x, y] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
          const newX = position[0] + x;
          const newY = position[1] + y;

          if (
            newX >= 0 && newX < cloneFields.length && newY >= 0 &&
            newY < cloneFields[newX].length
          ) {
            if (
              cloneFields[newX][newY] !== "#" && !visited.has(`${newX},${newY}`)
            ) {
              queue.push([[newX, newY], step + 1]);
              visited.add(`${newX},${newY}`);
            }
          }
        }
      }
    }
  }
}

const maxStep = Math.max(...Array.from(result.keys()));

console.log(
  result
    .entries()
    .map(([key, value]) => {
      return {
        diff: maxStep - key,
        count: value,
      };
    })
    .filter((v) => v.diff > 99)
    .reduce((acc, v) => acc + v.count, 0),
);
