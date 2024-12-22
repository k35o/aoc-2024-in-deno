import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
)).split("\n").map(Number);

const prune = (secN: number) => {
  return secN % 16777216;
};

const mix = (secN: number, newN: number) => {
  return Number(BigInt(secN) ^ BigInt(newN));
};

const ev1 = (secN: number) => {
  return prune(mix(secN, secN * 64));
};

const ev2 = (secN: number) => {
  return prune(mix(secN, Math.floor(secN / 32)));
};

const ev3 = (secN: number) => {
  return prune(mix(secN, secN * 2048));
};

const convertSecretNumber = (secN: number) => {
  let nextN = secN;
  for (let i = 0; i < 2000; i++) {
    nextN = ev3(ev2(ev1(nextN)));
  }
  return nextN;
};

let result = 0;
for (const line of lines) {
  result += convertSecretNumber(line);
}
console.log(result);
