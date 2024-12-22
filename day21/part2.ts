import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";

// 7 8 9
// 4 5 6
// 1 2 3
//   0 A

//   ^ A
// < v >

const nkMap = [["7", "8", "9"], ["4", "5", "6"], ["1", "2", "3"], [
  "#",
  "0",
  "A",
]] as const;
const dkMap = [["#", "top", "A"], ["left", "bottom", "right"]] as const;

type NKKey = typeof nkMap[number][number];
type DKKey = typeof dkMap[number][number];

const lines = (await readFileAsString(
  path.join(import.meta.dirname ?? "", "input.txt"),
)).split("\n");

let result = 0;

// only have enough for what I answered
const nkTransitionMap = new Map<string, DKKey[][]>();
nkTransitionMap.set("A-1", [["top", "left", "left"]]);
nkTransitionMap.set("A-2", [["top", "left"], ["left", "top"]]);
nkTransitionMap.set("A-3", [["top"]]);
nkTransitionMap.set("A-7", [["top", "top", "top", "left", "left"]]);
nkTransitionMap.set("A-9", [["top", "top", "top"]]);
nkTransitionMap.set("0-A", [["right"]]);
nkTransitionMap.set("6-A", [["bottom", "bottom"]]);
nkTransitionMap.set("8-A", [["right", "bottom", "bottom", "bottom"], [
  "bottom",
  "bottom",
  "bottom",
  "right",
]]);
nkTransitionMap.set("9-A", [["bottom", "bottom", "bottom"]]);
nkTransitionMap.set("1-7", [["top", "top"]]);
nkTransitionMap.set("2-8", [["top", "top"]]);
nkTransitionMap.set("3-4", [["left", "left", "top"], ["top", "left", "left"]]);
nkTransitionMap.set("4-9", [["top", "right", "right"], [
  "right",
  "right",
  "top",
]]);
nkTransitionMap.set("6-8", [["top", "left"], ["left", "top"]]);
nkTransitionMap.set("7-0", [["right", "bottom", "bottom", "bottom"]]);
nkTransitionMap.set("7-8", [["right"]]);
nkTransitionMap.set("8-6", [["bottom", "right"], ["right", "bottom"]]);
nkTransitionMap.set("8-9", [["right"]]);
nkTransitionMap.set("9-6", [["bottom"]]);

const dkTransitionMap = new Map<string, DKKey[][]>();
dkTransitionMap.set("A-A", [[]]);
dkTransitionMap.set("A-top", [["left"]]);
dkTransitionMap.set("A-left", [["bottom", "left", "left"]]);
dkTransitionMap.set("A-right", [["bottom"]]);
dkTransitionMap.set("A-bottom", [["bottom", "left"], ["left", "bottom"]]);
dkTransitionMap.set("top-A", [["right"]]);
dkTransitionMap.set("left-A", [["right", "right", "top"]]);
dkTransitionMap.set("right-A", [["top"]]);
dkTransitionMap.set("bottom-A", [["top", "right"], ["right", "top"]]);
dkTransitionMap.set("top-top", [[]]);
dkTransitionMap.set("top-left", [["bottom", "left"]]);
dkTransitionMap.set("top-right", [["bottom", "right"], ["right", "bottom"]]);
dkTransitionMap.set("top-bottom", [["bottom"]]);
dkTransitionMap.set("left-top", [["right", "top"]]);
dkTransitionMap.set("left-left", [[]]);
dkTransitionMap.set("left-right", [["right", "right"]]);
dkTransitionMap.set("left-bottom", [["right"]]);
dkTransitionMap.set("right-top", [["left", "top"], ["top", "left"]]);
dkTransitionMap.set("right-left", [["left", "left"]]);
dkTransitionMap.set("right-right", [[]]);
dkTransitionMap.set("right-bottom", [["left"]]);
dkTransitionMap.set("bottom-top", [["top"]]);
dkTransitionMap.set("bottom-left", [["left"]]);
dkTransitionMap.set("bottom-right", [["right"]]);
dkTransitionMap.set("bottom-bottom", [[]]);

const reMap = new Map<string, number>();
for (const line of lines) {
  const re = (operations: DKKey[], count: number) => {
    if (count === 0) {
      return operations.length + 1;
    }
    if (reMap.has(`${operations.join("-")}-${count}`)) {
      return reMap.get(`${operations.join("-")}-${count}`)!;
    }
    let len = 0;
    const aOperations: DKKey[] = ["A", ...operations, "A"];
    for (let i = 1; i < aOperations.length; i++) {
      len += Math.min(
        ...dkTransitionMap.get(`${aOperations[i - 1]}-${aOperations[i]}`)!.map((
          routes,
        ) => re(routes, count - 1)),
      );
    }
    reMap.set(`${operations.join("-")}-${count}`, len);
    return len;
  };

  let sum = 0;
  const firstOperation: DKKey[][][] = [];
  let firstKey: NKKey = "A";
  for (const char of line) {
    const routes = nkTransitionMap.get(`${firstKey}-${char}`)!;
    if (!routes) {
      throw new Error("No route found");
    }
    firstOperation.push(routes);
    firstKey = char as NKKey;
  }
  for (const fo of firstOperation) {
    sum += Math.min(
      ...fo.map((routes) => re(routes, 25)),
    );
  }
  result += sum * Number(line.slice(0, line.length - 1));
}

console.log(result);
