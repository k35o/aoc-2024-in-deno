import * as path from "jsr:@std/path";
import { readFileAsString } from "../utils.ts";
import { Hono } from "jsr:@hono/hono";

const getBoards = async () => {
  const lines = (await readFileAsString(
    path.join(import.meta.dirname ?? "", "input.txt"),
  )).split("\n");

  const HEIGHT = 103;
  const WIDTH = 101;

  const initialBoard: string[][] = [];
  for (let i = 0; i < WIDTH; i++) {
    initialBoard.push([]);
    for (let j = 0; j < HEIGHT; j++) {
      initialBoard[i].push(" ");
    }
  }
  let turn = 0;
  const boards: (typeof initialBoard)[] = [];
  while (turn < WIDTH * HEIGHT) {
    const board = structuredClone(initialBoard);
    for (const line of lines) {
      const [p, v] = line.split(" ");
      const [px, py] = p.slice(2).split(",").map(Number);
      const [vx, vy] = v.slice(2).split(",").map(Number);

      let x = (px + vx * turn) % WIDTH;
      let y = (py + vy * turn) % HEIGHT;
      x = x < 0 ? x + WIDTH : x;
      y = y < 0 ? y + HEIGHT : y;
      board[x][y] = "#";
    }
    boards.push(board);
    turn++;
  }
  return boards;
};

// 6668
const app = new Hono();
const boards = await getBoards();
app.get("/", (c) => {
  const page = Number(c.req.queries("page") ?? 1);
  // 89
  const perPage = 75;
  const showBoards = boards.slice((page - 1) * perPage, page * perPage);
  return c.html(
    <html>
      <head>
        <title>day14 part2</title>
      </head>
      <body>
        <main
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div style={{ display: "flex", gap: "4px" }}>
            <a href={`/?page=${page - 1}`}>Prev</a>
            <a href={`/?page=${page + 1}`}>Next</a>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            {showBoards.map((board, i) => (
              <div key={i}>
                <p>{(page - 1) * perPage + i}</p>
                <div
                  key={i}
                  style={{ border: "1px solid black" }}
                >
                  <svg
                    width={101}
                    height={103}
                  >
                    {board.map((row, rowIndex) =>
                      row.map((cell, colIndex) =>
                        cell === "#"
                          ? (
                            <rect
                              key={`${rowIndex}-${colIndex}`}
                              x={rowIndex}
                              y={colIndex}
                              width={1}
                              height={1}
                              fill="black"
                            />
                          )
                          : null
                      )
                    )}
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </main>
      </body>
    </html>,
  );
});
export default app;
