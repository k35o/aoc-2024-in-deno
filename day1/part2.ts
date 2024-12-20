import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const lines = (
  await readFileAsString(path.join(import.meta.dirname ?? "", "input.txt"))
).split("\n");

const left: number[] = [];
const right: number[] = [];

for (const line of lines) {
  const [num1, num2] = line.split("   ");
  left.push(parseInt(num1));
  right.push(parseInt(num2));
}

const similarity = new Map<number, number>();
for (let i = 0; i < right.length; i++) {
  if (similarity.has(right[i])) {
    similarity.set(right[i], (similarity.get(right[i]) ?? 0) + 1);
  } else {
    similarity.set(right[i], 1);
  }
}

let result = 0;
for (let i = 0; i < left.length; i++) {
  result += left[i] * (similarity.get(left[i]) ?? 0);
}

console.log(result);
