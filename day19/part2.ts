import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
)).split("\n\n");

const candidates = lines[0].split(", ");
const targets = lines[1].split("\n");

let result = 0;
for (const target of targets) {
  const targetMap = new Map<string, number>();
  const re = (tar: string): number => {
    if (targetMap.has(tar)) {
      return targetMap.get(tar) ?? 0;
    }

    if (tar === "") {
      return 1;
    }

    let count = 0;
    for (const candidate of candidates) {
      if (tar.startsWith(candidate)) {
        count += re(tar.slice(candidate.length));
      }
    }

    targetMap.set(tar, count);

    return count;
  };

  result += re(target);
}

console.log(result);
