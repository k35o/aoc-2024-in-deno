import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
)).split("\n");

const lanMap = new Map<string, Set<string>>();

for (const line of lines) {
  const [lan1, lan2] = line.split("-");
  lanMap.set(lan1, new Set([...lanMap.get(lan1) ?? [], lan2]));
  lanMap.set(lan2, new Set([...lanMap.get(lan2) ?? [], lan1]));
}


let count = 0;
for (const [lan, connections] of lanMap) {
  for (const connection1 of connections) {
    const connections2 = new Set(connections);
    connections2.delete(connection1);
    for (const connection2 of connections2) {
      if (connection1 === connection2) continue;
      if (lanMap.get(connection1)?.has(connection2)) {
        if (lan.startsWith("t") || connection1.startsWith("t") || connection2.startsWith("t")) {
          count++;
        }
      }
    }
  }
}

console.log(count / 6);
