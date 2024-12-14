import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
)).split("\n");

const HEIGHT = 103;
const WIDTH = 101;
const MAX_TURN = 100;

const xc = Math.floor(WIDTH / 2);
const yc = Math.floor(HEIGHT / 2);
let result1 = 0;
let result2 = 0;
let result3 = 0;
let result4 = 0;
for (const line of lines) {
  const [p, v] = line.split(" ");
  const [px, py] = p.slice(2).split(",").map(Number);
  const [vx, vy] = v.slice(2).split(",").map(Number);

  let x = (px + vx * MAX_TURN) % WIDTH;
  let y = (py + vy * MAX_TURN) % HEIGHT;
  x = x < 0 ? x + WIDTH : x;
  y = y < 0 ? y + HEIGHT : y;
  if (x < xc && y < yc) {
    result1++;
  }
  if (x > xc && y < yc) {
    result2++;
  }
  if (x < xc && y > yc) {
    result3++;
  }
  if (x > xc && y > yc) {
    result4++;
  }
}

console.log(result1 * result2 * result3 * result4);
