import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
)).split("\n\n");

const candidates = lines[0].split(", ");
const targets = lines[1].split("\n");

let result = 0;
for (const target of targets) {
  let isComplete = false;
  const checkedTarget = new Set<string>();
  const re = (tar: string) => {
    if (isComplete) {
      return;
    }
    if (tar === "") {
      isComplete = true;
      return;
    }
    if (checkedTarget.has(tar)) {
      return;
    }

    for (const candidate of candidates) {
      if (tar.startsWith(candidate)) {
        re(tar.slice(candidate.length));
      }
    }
    checkedTarget.add(tar);
  };

  re(target);

  if (isComplete) {
    result++;
  }
}

console.log(result);
