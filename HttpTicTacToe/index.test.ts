import httpFunction from "./index";
import context from "../tests/defaultContext";

test("Http trigger should process a valid board", async () => {
  const request = {
    query: { board: "+xxo++o++".replace(/\+/g, " ") },
  };

  await httpFunction(context, request);

  expect(context!.res!.status).toBe(200);
  expect(context!.res!.body).not.toMatch(/[^xo\s]/);
});

test("Http trigger should send bad request if board has too few chars", async () => {
  const request = {
    query: { board: "+xxo++o+".replace(/\+/g, " ") },
  };

  await httpFunction(context, request);

  expect(context!.res!.status).toBe(400);
  expect(context!.res!.body).toContain("Invalid board length");
});

test("Http trigger should send bad request if board chars outside expected", async () => {
  const request = {
    query: { board: "+xxoR++o+".replace(/\+/g, " ") },
  };

  await httpFunction(context, request);

  expect(context!.res!.status).toBe(400);
  expect(context!.res!.body).toContain("Invalid character in board");
});

test("Http trigger should send bad request if it is not server's turn", async () => {
  const request = {
    query: { board: "+x+o+++o+".replace(/\+/g, " ") },
  };

  await httpFunction(context, request);

  expect(context!.res!.status).toBe(400);
  expect(context!.res!.body).toContain("Not server's turn");
});

test("Http trigger should send back same board if x wins", async () => {
  const request = {
    query: { board: "xxxo+++o+".replace(/\+/g, " ") },
  };

  await httpFunction(context, request);

  expect(context!.res!.status).toBe(200);
  expect(context!.res!.body).toBe(`${request.query.board}`);
});

it.each([
  ["oo++++xx+", "ooo+++xx+"],
  ["o++o+++xx", "o++o++oxx"],
  ["+++o++oxx", "o++o++oxx"],
  ["+o++o+x+x", "+o++o+xox"],
  ["++o++oxx+", "++o++oxxo"],
])(
  "Http trigger should send winning move if server can win %s",
  async (input, expected) => {
    const request = {
      query: { board: input.replace(/\+/g, " ") },
    };

    await httpFunction(context, request);

    expect(context!.res!.status).toBe(200);
    expect(context!.res!.body).toBe(`${expected.replace(/\+/g, " ")}`);
  }
);
