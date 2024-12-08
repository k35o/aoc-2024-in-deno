import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
)).split("\n");

const antinodes = new Set<string>();
const antenna = new Map<string, string[]>();

for (let i = 0; i < lines.length; i++) {
  for (let j = 0; j < lines[i].length; j++) {
    if (lines[i][j] === '.') {
      continue;
    }
    if (antenna.has(lines[i][j])) {
      for (const node of antenna.get(lines[i][j]) ?? []) {
        const [y, x] = node.split(",").map(Number);
        const dx = j - x;
        const dy = i - y;

        let antinodesCandidateX = j;
        let antinodesCandidateY = i;
        while (antinodesCandidateY >= 0 && antinodesCandidateX >= 0 && antinodesCandidateY < lines.length && antinodesCandidateX < lines[0].length) {
          antinodes.add(`${antinodesCandidateY},${antinodesCandidateX}`);
          antinodesCandidateX += dx;
          antinodesCandidateY += dy;
        }
        antinodesCandidateX = x;
        antinodesCandidateY = y;
        while (antinodesCandidateY >= 0 && antinodesCandidateX >= 0 && antinodesCandidateY < lines.length && antinodesCandidateX < lines[0].length) {
          antinodes.add(`${antinodesCandidateY},${antinodesCandidateX}`);
          antinodesCandidateX -= dx;
          antinodesCandidateY -= dy;
        }
      }
      antenna.get(lines[i][j])?.push(`${i},${j}`);
    } else {
      antenna.set(lines[i][j], [`${i},${j}`]);
    }
  }
}

console.log(antinodes.size);
