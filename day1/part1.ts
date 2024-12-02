import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt")
)).split("\n");

const left: number[] = [];
const right: number[] = [];

for (const line of lines) {
  const [num1, num2] = line.split("   ");
  left.push(parseInt(num1));
  right.push(parseInt(num2));
}

left.sort();
right.sort();
let result = 0;

for (let i = 0; i < left.length; i++) {
  result += Math.abs(left[i] - right[i]);
}

console.log(result);
