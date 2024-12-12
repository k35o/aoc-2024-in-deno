import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
)).split("\n");

const resultMap = [];

const garden: (string)[][] = [];

for (const line of lines) {
  garden.push(line.split(""));
}

const gardenMap = new Map<string, (string | null)[][]>();

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (let j = 0; j < line.length; j++) {
    const currentGarden = gardenMap.get(garden[i][j]) ?? structuredClone(garden);
    const char = currentGarden[i][j];
    if (char === null) {
      continue;
    }
    let fence = 0;
    let count = 0;

    const adjacent = (x: number, y: number) => {
      count++;
      currentGarden[y][x] = null;
      // top
      if (y - 1 >= 0) {
        if (currentGarden[y - 1][x]) {
          const topChar = currentGarden[y - 1][x];
          if (topChar !== char) {
            if (x - 1 < 0 || garden[y][x - 1] !== char || garden[y - 1][x - 1] === char) {
              fence++;
            }
          } else {
            adjacent(x, y - 1);
          }
        }
      } else {
        if (x - 1 < 0 || garden[y][x - 1] !== char) {
          fence++;
        }
      }
      // bottom
      if (y + 1 < lines.length) {
        if (currentGarden[y + 1][x]) {
          const bottomChar = currentGarden[y + 1][x];
          if (bottomChar !== char) {
            if (x + 1 >= line.length || garden[y][x + 1] !== char || garden[y + 1][x + 1] === char) {
              fence++;
            }
          } else {
            adjacent(x, y + 1);
          }
        }
      } else {
        if (x + 1 >= line.length || garden[y][x + 1] !== char) {
          fence++;
        }
      }
      // left
      if (x - 1 >= 0) {
        if (currentGarden[y][x - 1]) {
          const leftChar = currentGarden[y][x - 1];
          if (leftChar !== char) {
            if (y - 1 < 0 || garden[y - 1][x] !== char || garden[y - 1][x - 1] === char) {
              fence++;
            }
          } else {
            adjacent(x - 1, y);
          }
        }
      } else {
        if (y - 1 < 0 || garden[y - 1][x] !== char) {
          fence++;
        }
      }
      // right
      if (x + 1 < line.length) {
        if (currentGarden[y][x + 1]) {
          const rightChar = currentGarden[y][x + 1];
          if (rightChar !== char) {
            if (y + 1 >= lines.length || garden[y + 1][x] !== char || garden[y + 1][x + 1] === char) {
              fence++;
            }
          } else {
            adjacent(x + 1, y);
          }
        }
      } else {
        if (y + 1 >= lines.length || garden[y + 1][x] !== char) {
          fence++;
        }
      }
    }
    adjacent(j, i);

    gardenMap.set(char, currentGarden);
    resultMap.push({ count, fence });
  }
}

let result = 0;
for (const value of resultMap) {
  result += value.count * value.fence;
}
console.log(result);
