import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt")
)).split("\n");

let result = 0;

for (const line of lines) {
  const numbers = line.split(" ");

  const isAscending = numbers.every((num, i) => {
    if (i === 0) {
      return true;
    }
    return parseInt(num) >= parseInt(numbers[i - 1]);
  });
  const isDescending = numbers.every((num, i) => {
    if (i === 0) {
      return true;
    }
    return parseInt(num) <= parseInt(numbers[i - 1]);
  });

  if (!isAscending && !isDescending) {
    continue;
  }

  const isSafeStairs = numbers.every((num, i) => {
    if (i === 0) {
      return true;
    }

    const diff = Math.abs(parseInt(num) - parseInt(numbers[i - 1]));
    if (diff > 0 && diff < 4) {
      return true;
    };

    return false;
  });

  if (!isSafeStairs) {
    continue;
  }

  result++;
}

console.log(result);
