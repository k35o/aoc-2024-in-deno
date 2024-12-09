import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const line = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
));

let block = [];
let insertNum = 0;
let isInsertNum = true;
const blockCountMap = new Map<number, number>();

for (const char of line) {
  if (isInsertNum) {
    for (let i = 0; i < Number(char); i++) {
      blockCountMap.set(insertNum, (blockCountMap.get(insertNum) ?? 0) + 1);
      block.push(String(insertNum));
    }
    insertNum++;
    isInsertNum = false;
  } else {
    for (let i = 0; i < Number(char); i++) {
      block.push('.');
    }
    isInsertNum = true;
  }
}

for (let i = block.length - 1; i >= 0; i--) {
  if (block[i] === '.') {
    continue;
  }
  const targetCount: number = blockCountMap.get(Number(block[i])) ?? 0;
  if (targetCount >= 1) {
    let blankCount = 0;
    for (let j = 0; j < block.length; j++) {
      if (j >= i) {
        break;
      }
      if (block[j] === '.') {
        blankCount++;
      } else {
        if (blankCount >= targetCount) {
          block = [
            ...block.slice(0, j - blankCount),
            ...(new Array(targetCount).fill(block[i])),
            ...block.slice(j - blankCount + targetCount, i - targetCount + 1),
            ...(new Array(targetCount).fill('.')),
            ...block.slice(i + 1),
          ];
          blankCount = 0;
          break;
        }
        blankCount = 0;
      }
    }
    i -= targetCount - 1;
  }
}

let result = 0;

for (let i = 0; i < block.length; i++) {
  if (block[i] === '.') {
    continue;
  }
  result += Number(block[i]) * i;
}

console.log(result);
