import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

// 7 8 9
// 4 5 6
// 1 2 3
//   0 A

//   ^ A
// < v >

// 029A
// <A^A>^^AvvvA
// v<<A>>^A<A>AvA<^AA>A<vAAA>^A
// <vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A

// ^<<A
// <Av<AA>>^A
// <<^A
// v<<AA>^A>A

const nkMap = [["7", "8", "9"], ["4", "5", "6"], ["1", "2", "3"], [
  "#",
  "0",
  "A",
]] as const;
const nkPosition = {
  "0": [3, 1],
  "1": [2, 0],
  "2": [2, 1],
  "3": [2, 2],
  "4": [1, 0],
  "5": [1, 1],
  "6": [1, 2],
  "7": [0, 0],
  "8": [0, 1],
  "9": [0, 2],
  A: [3, 2],
} as const;
const dkMap = [["#", "top", "A"], ["left", "bottom", "right"]] as const;
const dkPosition = {
  top: [0, 1],
  left: [1, 0],
  right: [1, 2],
  bottom: [1, 1],
  A: [0, 2],
} as const;

type NKKey = typeof nkMap[number][number];
type DKKey = typeof dkMap[number][number];

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
)).split("\n");

let result = 0;

const nkRoutes = (start: NKKey, end: NKKey) => {
  if (start === "#" || end === "#") {
    return undefined;
  }
  const startPositions = nkPosition[start];
  const endPositions = nkPosition[end];

  const queue: [readonly [number, number], DKKey[]][] = [[startPositions, []]];
  const visited = new Set<string>(start);
  while (queue.length > 0) {
    const [current, routes] = queue.shift()!;
    if (current[0] === endPositions[0] && current[1] === endPositions[1]) {
      const sortedRoutes = routes.sort();
      let position = nkPosition[start];
      let invalid = false;
      for (const route of sortedRoutes) {
        if (nkMap[position[0]][position[1]] === "#") {
          invalid = true;
          break;
        }
        if (route == "#") {
          throw new Error("Invalid route");
        }
        if (route === "top") {
          position = [
            position[0] - 1,
            position[1],
          ] as typeof nkPosition[keyof typeof nkPosition];
        }
        if (route === "bottom") {
          position = [
            position[0] + 1,
            position[1],
          ] as typeof nkPosition[keyof typeof nkPosition];
        }
        if (route === "left") {
          position = [
            position[0],
            position[1] - 1,
          ] as typeof nkPosition[keyof typeof nkPosition];
        }
        if (route === "right") {
          position = [
            position[0],
            position[1] + 1,
          ] as typeof nkPosition[keyof typeof nkPosition];
        }
      }
      let result = sortedRoutes;
      if (invalid) {
        result = sortedRoutes.reverse();
      }
      return result;
    }
    for (
      const [dx, dy, direction] of [[-1, 0, "top"], [1, 0, "bottom"], [
        0,
        -1,
        "left",
      ], [0, 1, "right"]] as const
    ) {
      const nextX = current[0] + dx;
      const nextY = current[1] + dy;
      if (nextX >= 0 && nextX < 4 && nextY >= 0 && nextY < 3) {
        const nextKey = nkMap[nextX][nextY];
        if (nextKey !== "#" && !visited.has(nextKey)) {
          visited.add(nextKey);
          queue.push(
            [
              [nextX, nextY],
              [...routes, direction],
            ],
          );
        }
      }
    }
  }
};

const dkRoutes = (start: DKKey, end: DKKey) => {
  if (start === "#" || end === "#") {
    return undefined;
  }
  const startPositions = dkPosition[start];
  const endPositions = dkPosition[end];

  const queue: [readonly [number, number], DKKey[]][] = [[startPositions, []]];
  const visited = new Set<string>(start);
  while (queue.length > 0) {
    const [current, routes] = queue.shift()!;
    if (current[0] === endPositions[0] && current[1] === endPositions[1]) {
      const sortedRoutes = routes.sort();
      let position = dkPosition[start];
      let invalid = false;
      for (const route of sortedRoutes) {
        if (dkMap[position[0]][position[1]] === "#") {
          invalid = true;
          break;
        }
        if (route == "#") {
          throw new Error("Invalid route");
        }
        if (route === "top") {
          position = [
            position[0] - 1,
            position[1],
          ] as typeof dkPosition[keyof typeof dkPosition];
        }
        if (route === "bottom") {
          position = [
            position[0] + 1,
            position[1],
          ] as typeof dkPosition[keyof typeof dkPosition];
        }
        if (route === "left") {
          position = [
            position[0],
            position[1] - 1,
          ] as typeof dkPosition[keyof typeof dkPosition];
        }
        if (route === "right") {
          position = [
            position[0],
            position[1] + 1,
          ] as typeof dkPosition[keyof typeof dkPosition];
        }
      }
      let result = sortedRoutes;
      if (invalid) {
        result = sortedRoutes.reverse();
      }
      return result;
    }
    for (
      const [dx, dy, direction] of [[-1, 0, "top"], [1, 0, "bottom"], [
        0,
        -1,
        "left",
      ], [0, 1, "right"]] as const
    ) {
      const nextX = current[0] + dx;
      const nextY = current[1] + dy;
      if (nextX >= 0 && nextX < 2 && nextY >= 0 && nextY < 3) {
        const nextKey = dkMap[nextX][nextY];
        if (nextKey !== "#" && !visited.has(nextKey)) {
          visited.add(nextKey);
          queue.push(
            [
              [nextX, nextY],
              [...routes, direction],
            ],
          );
        }
      }
    }
  }
};

for (const line of lines) {
  let firstOperation: DKKey[] = [];
  let firstKey: NKKey = "A";
  for (const char of line) {
    const routes = nkRoutes(firstKey, char as NKKey);
    if (!routes) {
      throw new Error("No route found");
    }
    firstOperation = [...firstOperation, ...routes, "A"];
    firstKey = char as NKKey;
  }

  let secondaOperation: DKKey[] = [];
  let secondKey: DKKey = "A";
  for (const char of firstOperation) {
    const routes = dkRoutes(secondKey, char as DKKey);
    if (!routes) {
      throw new Error("No route found");
    }
    secondaOperation = [...secondaOperation, ...routes, "A"];
    secondKey = char as DKKey;
  }

  let thirdOperation: DKKey[] = [];
  let thirdKey: DKKey = "A";
  for (const char of secondaOperation) {
    const routes = dkRoutes(thirdKey, char as DKKey);
    if (!routes) {
      throw new Error("No route found");
    }
    thirdOperation = [...thirdOperation, ...routes, "A"];
    thirdKey = char as DKKey;
  }

  result += thirdOperation.length * Number(line.slice(0, line.length - 1));
}

console.log(result);
