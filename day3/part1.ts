import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
)).split("\n");

const regex = /mul\(\d+,\s*\d+\)/g;

let result = 0;
for (const line of lines) {
  const matches = line.match(regex);
  for (const match of matches ?? []) {
    const [a, b] = match.slice(4, -1).split(",").map(Number);
    result += a * b;
  }
}

console.log(result);
