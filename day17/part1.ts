import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
)).split("\n");

let A = Number(lines[0].split(" ")[2]);
let B = Number(lines[1].split(" ")[2]);
let C = Number(lines[2].split(" ")[2]);
const programs = lines[4].split(" ")[1].split(",").map(Number);

const result: string[] = [];
for (let i = 0; i < programs.length; i++) {
  if (i === programs.length - 1) {
    break;
  }
  if (programs[i] === 0) {
    A = Math.floor(A / 2 ** convertComboOperand(programs[i + 1]));
    i++;
    continue;
  }
  if (programs[i] === 1) {
    B = B ^ programs[i + 1];
    i++;
    continue;
  }
  if (programs[i] === 2) {
    B = convertComboOperand(programs[i + 1]) % 8;
    i++;
    continue;
  }
  if (programs[i] === 3) {
    if (A != 0 && i + 2 > programs[i + 1]) {
      i = programs[i + 1] - 1;
    }
    continue;
  }
  if (programs[i] === 4) {
    B = B ^ C;
    i++;
    continue;
  }
  if (programs[i] === 5) {
    result.push((convertComboOperand(programs[i + 1]) % 8).toString());
    i++;
    continue;
  }
  if (programs[i] === 6) {
    B = Math.floor(A / 2 ** convertComboOperand(programs[i + 1]));
    i++;
    continue;
  }
  if (programs[i] === 7) {
    C = Math.floor(A / 2 ** convertComboOperand(programs[i + 1]));
    i++;
    continue;
  }
}

console.log(result.toString());

function convertComboOperand(oeprand: number) {
  if (oeprand === 4) {
    return A;
  }
  if (oeprand === 5) {
    return B;
  }
  if (oeprand === 6) {
    return C;
  }
  return oeprand;
}
