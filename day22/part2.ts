import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
)).split("\n").map(Number);


const prune = (secN: number) => {
  return secN % 16777216
}

const mix = (secN: number, newN: number) => {
  return Number(BigInt(secN) ^ BigInt(newN))
}

const ev1 = (secN: number) => {
  return prune(mix(secN, secN * 64))
}

const ev2 = (secN: number) => {
  return prune(mix(secN, Math.floor(secN / 32)))
}

const ev3 = (secN: number) => {
  return prune(mix(secN, secN * 2048))
}


const freq = new Map<string, number>()

const convertSecretNumber = (secN: number) => {
  let nextN = secN;
  const changes = [nextN % 10]
  const prices = [0]
  const visited = new Set<string>()
  for (let i = 0; i < 2000; i++) {
    nextN = ev3(ev2(ev1(nextN)))
    prices.push(nextN % 10)
    changes.push(prices[prices.length - 1] - prices[prices.length - 2])
    const key = changes.slice(changes.length - 4, changes.length).join("-")
    if (!visited.has(key)) {
      freq.set(key, (freq.get(key) ?? 0) + prices[prices.length - 1])
      visited.add(key)
    }
  }
}

for (const line of lines) {
  convertSecretNumber(line)
}
console.log(Math.max(...freq.values()));
