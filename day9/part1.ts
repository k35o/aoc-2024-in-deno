import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const line = await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
);

let block = [];
let insertNum = 0;
let isInsertNum = true;

for (const char of line) {
  if (isInsertNum) {
    for (let i = 0; i < Number(char); i++) {
      block.push(String(insertNum));
    }
    insertNum++;
    isInsertNum = false;
  } else {
    for (let i = 0; i < Number(char); i++) {
      block.push(".");
    }
    isInsertNum = true;
  }
}

let trimedBlockIdx = block.length - 1;
for (let i = 0; i < block.length; i++) {
  if (i >= trimedBlockIdx) {
    break;
  }
  if (block[i] === ".") {
    while (block[trimedBlockIdx] === ".") {
      trimedBlockIdx--;
    }
    block = [
      ...block.slice(0, i),
      block[trimedBlockIdx],
      ...block.slice(i + 1, trimedBlockIdx),
      ".",
      ...block.slice(trimedBlockIdx + 1),
    ];
  }
}

let result = 0;

for (let i = 0; i < block.length; i++) {
  if (block[i] === ".") {
    break;
  }
  result += Number(block[i]) * i;
}

console.log(result);
