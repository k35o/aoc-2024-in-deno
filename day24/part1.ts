import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

type Signal = 1 | 0;

const AND = "AND";
const XOR = "XOR";
const OR = "OR";

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
)).split("\n\n");

const [initialNumbers, calculations] = lines;

const numberMap = new Map<string, Signal>();

for (const initialNumber of initialNumbers.split("\n")) {
  const [key, value] = initialNumber.split(": ");
  numberMap.set(key, Number(value) ? 1 : 0);
}

const and = (a: Signal, b: Signal) => {
  if (a === 1 && b === 1) {
    return 1;
  }
  return 0;
};

const xor = (a: Signal, b: Signal) => {
  if (a === b) {
    return 0;
  }
  return 1;
};

const or = (a: Signal, b: Signal) => {
  if (a === 1 || b === 1) {
    return 1;
  }
  return 0;
};

const pad = (num: number) => num.toString().padStart(2, "0");

const queue: string[] = calculations.split("\n");
while (queue.length > 0) {
  const calculation = queue.shift();
  if (!calculation) {
    break;
  }
  const [arg1, operation, arg2, _, target] = calculation.split(" ");
  if (!numberMap.has(arg1) || !numberMap.has(arg2)) {
    queue.push(calculation);
    continue;
  }

  switch (operation) {
    case AND:
      numberMap.set(target, and(numberMap.get(arg1)!, numberMap.get(arg2)!));
      break;
    case XOR:
      numberMap.set(target, xor(numberMap.get(arg1)!, numberMap.get(arg2)!));
      break;
    case OR:
      numberMap.set(target, or(numberMap.get(arg1)!, numberMap.get(arg2)!));
      break;
  }
}

let i = 0;
const result: string[] = [];
while (numberMap.has(`z${pad(i)}`)) {
  result.push(numberMap.get(`z${pad(i)}`)?.toString()!);
  i++;
}

console.log(parseInt(result.reverse().join(""), 2));
