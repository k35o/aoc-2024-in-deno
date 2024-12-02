import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const isCheckSafeLine = (nums: string[]): boolean => {
  const isAscending = nums.every((num, i) => {
    if (i === 0) {
      return true;
    }
    return parseInt(num) >= parseInt(nums[i - 1]);
  });
  const isDescending = nums.every((num, i) => {
    if (i === 0) {
      return true;
    }
    return parseInt(num) <= parseInt(nums[i - 1]);
  });

  if (!isAscending && !isDescending) {
    return false;
  }

  const isSafeStairs = nums.every((num, i) => {
    if (i === 0) {
      return true;
    }

    const diff = Math.abs(parseInt(num) - parseInt(nums[i - 1]));
    if (diff > 0 && diff < 4) {
      return true;
    };

    return false;
  });

  return isSafeStairs;
}

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt")
)).split("\n");

let result = 0;

for (const line of lines) {
  const numbers = line.split(" ");

  if (!isCheckSafeLine(numbers)) {
    for (let i = 0; i < numbers.length; i++) {
      if (isCheckSafeLine([...numbers.slice(0, i), ...numbers.slice(i + 1)])) {
        result++;
        break;
      }
    }
    continue;
  }
  result++;
}

console.log(result);
