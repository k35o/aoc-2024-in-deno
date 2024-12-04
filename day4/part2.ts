import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
)).split("\n");

let result = 0;

for (let i = 0; i < lines.length; i++) {
  for (let j = 0; j < lines[0].length; j++) {
    if (i < 1 || j < 1 || i >= lines.length - 1 || j >= lines[0].length - 1) {
      continue;
    }
    if (lines[i][j] === 'A') {
      if (
        (
          (lines[i - 1][j - 1] === 'S' && lines[i + 1][j + 1] === 'M')
          || (lines[i - 1][j - 1] === 'M' && lines[i + 1][j + 1] === 'S')
        ) && (
          (lines[i - 1][j + 1] === 'S' && lines[i + 1][j - 1] === 'M')
          || (lines[i - 1][j + 1] === 'M' && lines[i + 1][j - 1] === 'S')
        )
      ) {
        result++;
      }
    }
  }
}

console.log(result);
