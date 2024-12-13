import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

let lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
)).split(" ");

const BREAKING = 25;

for (let i = 0; i < BREAKING; i++) {
  let nextLines = lines;
  let k = 0;
  console.log(nextLines);
  for (let j = 0; j < lines.length; j++) {
    if (lines[j] === "0") {
      nextLines[k] = "1";
      k++;
      continue;
    }
    if (lines[j].length % 2 === 0) {
      nextLines = [
        ...nextLines.slice(0, k),
        String(Number(lines[j].slice(0, lines[j].length / 2))),
        String(Number(lines[j].slice(lines[j].length / 2))),
        ...nextLines.slice(k + 2),
      ];
      k += 2;
      continue;
    }
    nextLines[k] = String(Number(lines[j]) * 2024);
    k++;
  }
  lines = nextLines;
}

console.log(lines.length);
