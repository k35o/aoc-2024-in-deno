import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
)).split("\n");

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
    currentGame.prize[0] = Number(numbers?.[0] ?? 0) + 10000000000000;
    currentGame.prize[1] = Number(numbers?.[1] ?? 0) + 10000000000000;
    games.push(currentGame);
  }
}

let result = 0;
// game.prize[0] = game.A[0] * x + game.B[0] * y
// game.prize[1] = game.A[1] * x + game.B[1] * y
for (const game of games) {
  // game.A[1] * game.prize[0] = game.A[1] * game.A[0] * x + game.A[1] * game.B[0] * y
  // game.A[0] * game.prize[1] = game.A[0] * game.A[1] * x + game.A[0] * game.B[1] * y

  const y = (game.prize[0] * game.A[1] - game.prize[1] * game.A[0]) /
    (game.B[0] * game.A[1] - game.B[1] * game.A[0]);
  const x = (game.prize[0] - game.B[0] * y) / game.A[0];

  if (x >= 0 && y >= 0 && x % 1 === 0 && y % 1 === 0) {
    result += x * A_POINT + y * B_POINT;
  }
}

console.log(result);
