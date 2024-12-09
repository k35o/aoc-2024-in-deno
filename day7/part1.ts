import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
)).split("\n");

let result = 0;

for (const line of lines) {
  const [tmpAnswer, ...rest] = line.split(" ");
  const answer = tmpAnswer.slice(0, -1);

  if (calibration(rest.slice(1), answer, Number(rest[0])) > 0) {
    result += Number(answer);
  }
}

console.log(result);

function calibration(values: string[], answer: string, result: number): number {
  if (values.length === 0) {
    return Number(answer) === result ? 1 : 0;
  }
  if (result > Number(answer)) {
    return 0;
  }

  return calibration(values.slice(1), answer, result + Number(values[0])) +
    calibration(values.slice(1), answer, result * Number(values[0]));
}
