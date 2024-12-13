import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
)).split("\n");

const MAX_PRESS = 100;
const A_POINT = 3;
const B_POINT = 1;

const games: {
  A: [number, number];
  B: [number, number];
  prize: [number, number];
}[] = [];

let currentGame: (typeof games)[number] = {
  A: [0, 0],
  B: [0, 0],
  prize: [0, 0],
};
for (const line of lines) {
  if (line === "") {
    currentGame = {
      A: [0, 0],
      B: [0, 0],
      prize: [0, 0],
    };
  }
  if (line.startsWith("Button A")) {
    const numbers = line.match(/\d+/g);
    currentGame.A[0] = Number(numbers?.[0] ?? 0);
    currentGame.A[1] = Number(numbers?.[1] ?? 0);
  }
  if (line.startsWith("Button B")) {
    const numbers = line.match(/\d+/g);
    currentGame.B[0] = Number(numbers?.[0] ?? 0);
    currentGame.B[1] = Number(numbers?.[1] ?? 0);
  }
  if (line.startsWith("Prize")) {
    const numbers = line.match(/\d+/g);
    currentGame.prize[0] = Number(numbers?.[0] ?? 0);
    currentGame.prize[1] = Number(numbers?.[1] ?? 0);
    games.push(currentGame);
  }
}

let result = 0;

for (const game of games) {
  const prevVisited = new Set<string>();
  const gets = new Set<string>();

  const re = (aPress: number, bPress: number) => {
    prevVisited.add(`${aPress},${bPress}`);
    if (
      (game.A[0] * aPress + game.B[0] * bPress === game.prize[0]) &&
      (game.A[1] * aPress + game.B[1] * bPress === game.prize[1])
    ) {
      gets.add(`${aPress},${bPress}`);
      return;
    }
    if (game.A[0] * aPress + game.B[0] * bPress > game.prize[0]) {
      return;
    }
    if (game.A[1] * aPress + game.B[1] * bPress > game.prize[1]) {
      return;
    }
    if (aPress <= MAX_PRESS) {
      if (!prevVisited.has(`${aPress + 1},${bPress}`)) {
        re(aPress + 1, bPress);
      }
    }
    if (bPress <= MAX_PRESS) {
      if (!prevVisited.has(`${aPress},${bPress + 1}`)) {
        re(aPress, bPress + 1);
      }
    }
  };

  re(0, 0);

  let minPoint = Number.MAX_SAFE_INTEGER;
  for (const get of gets) {
    const [a, b] = get.split(",").map(Number);
    if (a * A_POINT + b * B_POINT < minPoint) {
      minPoint = a * A_POINT + b * B_POINT;
    }
  }
  result += gets.size === 0 ? 0 : minPoint;
}

console.log(result);
