import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
)).split("\n");
const programs = lines[4].split(" ")[1].split(",").map(Number);
let b = 0;
let c = 0;

function re(program: number, result: number): boolean {
  if (program < 0) {
    console.log(result);
    return true;
  }
  for (let d = 0; d < 8; d++) {
    let a = Number(BigInt(result) << BigInt(3) | BigInt(d));
    let i = 0;
    let w;
    while (i < programs.length) {
      let o;
      if (programs[i + 1] <= 3) o = programs[i + 1];
      else if (programs[i + 1] === 4) o = a;
      else if (programs[i + 1] === 5) o = b;
      else o = c;

      if (programs[i] === 0) a = a >> o;
      else if (programs[i] === 1) b ^= programs[i + 1];
      else if (programs[i] === 2) b = o & 7;
      else if (programs[i] === 3) i = a !== 0 ? programs[i + 1] - 2 : i;
      else if (programs[i] === 4) b ^= c;
      else if (programs[i] === 5) {
        w = o & 7;
        break;
      } else if (programs[i] === 6) b = a >> o;
      else if (programs[i] === 7) c = a >> o;

      i += 2;
    }
    if (
      w === programs[program] &&
      re(program - 1, Number(BigInt(result) << BigInt(3) | BigInt(d)))
    ) {
      return true;
    }
  }
  return false;
}

re(programs.length - 1, 0);
