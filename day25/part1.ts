import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const HEIGHT = 7;
const WIDTH = 5;
const LOCK_LINE = new Array(WIDTH).fill("#").join("");

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
)).split("\n\n");

const keys: number[][] = [];
const doors: number[][] = [];

for (let i = 0; i < lines.length; i++) {
  const map = lines[i].split("\n");
  if (map[0] === LOCK_LINE) {
    const key: number[] = new Array(WIDTH).fill(0);
    for (const line of map) {
      for (let j = 0; j < line.length; j++) {
        if (line[j] === "#") {
          key[j]++;
        }
      }
    }
    keys.push(key);
  }
  if (map[map.length - 1] === LOCK_LINE) {
    const key: number[] = new Array(WIDTH).fill(0);
    for (const line of map) {
      for (let j = 0; j < line.length; j++) {
        if (line[j] === "#") {
          key[j]++;
        }
      }
    }
    doors.push(key);
  }
}

let result = 0;

for (const door of doors) {
  for (const key of keys) {
    let match = 0;
    for (let i = 0; i < WIDTH; i++) {
      if (key[i] + door[i] <= HEIGHT) {
        match++;
      }
    }
    if (match === WIDTH) {
      result++;
    }
  }
}

console.log(result);
