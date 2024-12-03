import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt")
)).split("\n");


let result = 0;

const regex = /(mul\((\d{1,3}),(\d{1,3})\))|(don't\(\)|do\(\))/gm;
let doCalc = true;

for (const line of lines) {
  const matches = line.matchAll(regex);

  for (const match of matches) {
    if (match[0] === 'do()') {
      doCalc = true;
      continue;
    }
    if (match[0] === "don't()") {
      doCalc = false;
      continue;
    }
    const [a, b] = match[0].slice(4, -1).split(",").map(Number);
    if (doCalc) {
      result += Number(a) * Number(b);
    }
  }
}

console.log(result);
