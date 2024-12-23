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

let connectionMap: {
  set: string;
  count: number;
} = {
  set: '',
  count: 0,
};
const lanOrderByAlphabet = [...lanMap.keys()].sort();
for (const lan of lanOrderByAlphabet) {
  const connections = lanMap.get(lan);
  if (!connections) continue;
  const results = new Set<string>();
  for (const connection1 of connections) {
    for (const connection2 of connections) {
      if (connection1 === connection2) continue;
      if (lanMap.get(connection1)?.has(connection2)) {
        results.add(connection1);
        results.add(connection2);
      }
    }
  }

  // yn cg vc wq
  // yn-cg yn-vc yn-wq cg-vc cg-wq vc-wq
  const tempMap = new Map<string, number>();
  const re = (queue: [Set<string>, number]) => {
    const [connections, count] = queue;
    if (tempMap.has([...connections].sort().join(","))) {
      return;
    }
    tempMap.set([...connections].sort().join(","), count);
    for (const result of results) {
      if (connections.has(result)) continue;
      if ([...connections].every((connection) => {
        if (result === connection) return true;
        return lanMap.get(connection)?.has(result)
      })) {
        re([new Set([...connections, result]), count + 1]);
      }
    }
  }

  re([new Set(), 0]);
  for (const [key, value] of tempMap) {
    if (value > connectionMap.count) {
      connectionMap = {
        set: [lan, ...key.split(',')].sort().join(","),
        count: value,
      };
    }
  }
}

console.log(connectionMap.set);
