import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
)).split("\n");

let isRule = true;
const order = new Map<string, string[]>();
const tests: string[][] = [];
for (const line of lines) {
  if (line === "") {
    isRule = false;
    continue;
  }
  if (isRule) {
    const [to, from] = line.split("|");
    const curTo = order.get(from) ?? [];
    order.set(from, [...curTo, to]);
  } else {
    tests.push(line.split(","));
  }
}

const invalidTests = [];
for (const test of tests) {
  let pass = true;
  for (let i = 0; i < test.length; i++) {
    const cur = test[i];
    const rest = test.slice(i + 1);
    const tos = order.get(cur) ?? [];
    for (const char of rest) {
      if (tos.includes(char)) {
        pass = false;
        break;
      }
    }
    if (!pass) {
      break;
    }
  }
  if (!pass) {
    invalidTests.push(test);
  }
}

let result = 0;
for (const test of invalidTests) {
  const orderdTest: string[] = test;

  for (let i = 0; i < test.length; i++) {
    const cur = test[i];
    const rest = test.slice(i + 1);
    const tos = order.get(cur) ?? [];
    for (let j = 0; j < rest.length; j++) {
      if (tos.includes(rest[j])) {
        orderdTest[i] = rest[j];
        orderdTest[i + j + 1] = cur;
        i--;
        break;
      }
    }
  }

  result += Number(orderdTest[Math.floor(orderdTest.length / 2)]);
}

console.log(result);