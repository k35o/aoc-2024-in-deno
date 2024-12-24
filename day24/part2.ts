// ref: https://www.reddit.com/r/adventofcode/comments/1hla5ql/2024_day_24_part_2_a_guide_on_the_idea_behind_the/
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

const result: string[] = [];

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

const expected: number[] = [];
let inc = 0;
let n = 0;
while (numberMap.has(`x${pad(n)}`)) {
  const x = numberMap.get(`x${pad(n)}`)!;
  const y = numberMap.get(`y${pad(n)}`)!;
  if (x === 1 && y === 1) {
    expected.push(inc);
    inc = 1;
  } else if (x === 0 && y === 0) {
    expected.push(inc);
    inc = 0;
  } else {
    if (inc === 1) {
      expected.push(0);
      inc = 1;
    } else {
      expected.push(1);
      inc = 0;
    }
  }
  n++;
}
expected.push(inc);

const candidateCalculates: string[] = [];
for (const calculation of calculations.split("\n")) {
  const [arg1, operation, arg2, _, target] = calculation.split(" ");
  if (
    target.startsWith("z") && !target.endsWith(n.toString()) &&
    operation !== XOR
  ) {
    result.push(target);
    continue;
  }
  if (
    !((arg1.startsWith("x") && arg2.startsWith("y")) ||
      (arg1.startsWith("y") && arg2.startsWith("x"))) &&
    !target.startsWith("z") && operation === XOR
  ) {
    candidateCalculates.push(calculation);
    result.push(target);
    continue;
  }
}

const swapPairs: string[][] = [];
for (let candidateCalculate of candidateCalculates) {
  const [_argInit1, _operationInit, _argInit2, _Init, targetInit] =
    candidateCalculate.split(" ");
  while (
    !candidateCalculate.slice(0, candidateCalculate.length - 2).endsWith("z")
  ) {
    const [_arg1, _operation, _arg2, _, target] = candidateCalculate.split(" ");
    for (const calculation of calculations.split("\n")) {
      const [arg1, _operation, arg2, _, _target] = calculation.split(" ");
      if (arg1 === target) {
        candidateCalculate = calculation;
        break;
      }
      if (arg2 === target) {
        candidateCalculate = calculation;
        break;
      }
    }
  }
  const [_arg1, _operation, _arg2, _, target] = candidateCalculate.split(" ");
  const last = Number(target.slice(target.length - 2));
  swapPairs.push([targetInit, `z${pad(last - 1)}`]);
}

const swapedNumberMap = new Map<string, Signal>();

for (const initialNumber of initialNumbers.split("\n")) {
  const [key, value] = initialNumber.split(": ");
  swapedNumberMap.set(key, Number(value) ? 1 : 0);
}

const swapedCalculations = calculations.split("\n").map((calculation) => {
  for (const swapPair of swapPairs) {
    const [target, swapTarget] = swapPair;
    if (calculation.includes(target)) {
      return calculation.replace(target, swapTarget);
    }
    if (calculation.includes(swapTarget)) {
      return calculation.replace(swapTarget, target);
    }
  }
  return calculation;
});
const swapedQueue: string[] = swapedCalculations;
while (swapedQueue.length > 0) {
  const calculation = swapedQueue.shift();
  if (!calculation) {
    break;
  }
  const [arg1, operation, arg2, _, target] = calculation.split(" ");
  if (!swapedNumberMap.has(arg1) || !swapedNumberMap.has(arg2)) {
    swapedQueue.push(calculation);
    continue;
  }

  switch (operation) {
    case AND:
      swapedNumberMap.set(
        target,
        and(swapedNumberMap.get(arg1)!, swapedNumberMap.get(arg2)!),
      );
      break;
    case XOR:
      swapedNumberMap.set(
        target,
        xor(swapedNumberMap.get(arg1)!, swapedNumberMap.get(arg2)!),
      );
      break;
    case OR:
      swapedNumberMap.set(
        target,
        or(swapedNumberMap.get(arg1)!, swapedNumberMap.get(arg2)!),
      );
      break;
  }
}

let j = 0;
const swapedResult: string[] = [];
while (swapedNumberMap.has(`z${pad(j)}`)) {
  swapedResult.push(swapedNumberMap.get(`z${pad(j)}`)?.toString()!);
  j++;
}

let wrongIndex = -1;
for (let n = 0; n < expected.length; n++) {
  if (xor(Number(expected[n]) as Signal, Number(swapedResult[n]) as Signal)) {
    wrongIndex = n;
    break;
  }
}
const wrong = swapedResult.length - wrongIndex - 1;
for (const calculation of calculations.split("\n")) {
  const [arg1, _operation, arg2, _, target] = calculation.split(" ");
  if (
    (arg1 === `x${pad(wrong)}` && arg2 === `y${pad(wrong)}`) ||
    (arg2 === `x${pad(wrong)}` && arg1 === `y${pad(wrong)}`)
  ) {
    result.push(target);
  }
}

// answer cqk,fph,gds,jrs,wrk,z15,z21,z34
console.log(result.sort().join(","));
