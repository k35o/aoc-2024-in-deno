import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
)).split(" ");

const BREAKING = 75;

let map = new Map<string, number>();

for (const line of lines) {
  map.set(line, (map.get(line) ?? 0) + 1);
}

for (let i = 0; i < BREAKING; i++) {
  const newMap = new Map<string, number>();
  const lines = Array.from(map.keys());
  for (let j = 0; j < lines.length; j++) {
    if (lines[j] === "0") {
      newMap.set("1", (newMap.get("1") ?? 0) + (map.get(lines[j]) ?? 1));
      continue;
    }
    if (lines[j].length % 2 === 0) {
      const before = String(Number(lines[j].slice(0, lines[j].length / 2)));
      const after = String(Number(lines[j].slice(lines[j].length / 2)));
      newMap.set(
        before,
        (newMap.get(before) ?? 0) + (map.get(lines[j]) ?? 1),
      );
      newMap.set(
        after,
        (newMap.get(after) ?? 0) + (map.get(lines[j]) ?? 1),
      );
      continue;
    }
    const nextNumber = String(Number(lines[j]) * 2024);
    newMap.set(
      nextNumber,
      (newMap.get(nextNumber) ?? 0) + (map.get(lines[j]) ?? 1),
    );
  }
  map = newMap;
}

let result = 0;
for (const value of map.values()) {
  result += value;
}

console.log(result);
