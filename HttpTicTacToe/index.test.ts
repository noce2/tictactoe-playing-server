import httpFunction from "./index";
import context from "../tests/defaultContext";

test("should process a valid board", async () => {
  const request = {
    query: { board: "+xxo++o++".replace(/\+/g, " ") },
  };

  await httpFunction(context, request);

  expect(context!.res!.status).toBe(200);
  expect(context!.res!.body).not.toMatch(/[^xo\s]/);
});

test("should send bad request if board has too few chars", async () => {
  const request = {
    query: { board: "+xxo++o+".replace(/\+/g, " ") },
  };

  await httpFunction(context, request);

  expect(context!.res!.status).toBe(400);
  expect(context!.res!.body).toContain("Invalid board length");
});

test("should send bad request if board chars outside expected", async () => {
  const request = {
    query: { board: "+xxoR++o+".replace(/\+/g, " ") },
  };

  await httpFunction(context, request);

  expect(context!.res!.status).toBe(400);
  expect(context!.res!.body).toContain("Invalid character in board");
});

test("should send bad request if it is not server's turn", async () => {
  const request = {
    query: { board: "+x+o+++o+".replace(/\+/g, " ") },
  };

  await httpFunction(context, request);

  expect(context!.res!.status).toBe(400);
  expect(context!.res!.body).toContain("Not server's turn");
});

test("should send back same board if x wins", async () => {
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
  "should send winning move if server can win %s as %s",
  async (input, expected) => {
    const request = {
      query: { board: input.replace(/\+/g, " ") },
    };

    await httpFunction(context, request);

    expect(context!.res!.status).toBe(200);
    expect(context!.res!.body).toBe(`${expected.replace(/\+/g, " ")}`);
  }
);

it.each([["ox++x+++o"]])(
  "should not attempt winning move if move position is taken %s",
  async (input) => {
    const request = {
      query: { board: input.replace(/\+/g, " ") },
    };

    const previousNumberOfServerMoves = [...request.query.board.matchAll(/o/g)]
      .length;

    await httpFunction(context, request);

    expect(context!.res!.status).toBe(200);

    const currentNumberOfServerMoves = [
      ...(context!.res!.body as string).matchAll(/o/g),
    ].length;

    expect(currentNumberOfServerMoves).toBeGreaterThan(
      previousNumberOfServerMoves
    );
  }
);

it.each([
  ["o+++++xx+", "o+++++xxo"],
  ["x++x+++o+", "x++x++oo+"],
  ["x+x++++o+", "xox++++o+"],
  ["x+++x++o+", "x+++x++oo"],
  ["+x++x+++o", "+x++x++oo"],
])(
  "Given player had first move, should block player's winning move in %s as %s",
  async (input, expected) => {
    const request = {
      query: { board: input.replace(/\+/g, " ") },
    };

    await httpFunction(context, request);

    expect(context!.res!.status).toBe(200);
    expect(context!.res!.body).toBe(`${expected.replace(/\+/g, " ")}`);
  }
);

it.each([
  ["o++++oxx+", "o++++oxxo"],
  ["x+ox+++o+", "x+ox++oo+"],
  ["x+x++o+o+", "xox++o+o+"],
  ["x+o+x++o+", "x+o+x++oo"],
  ["ox++x+++o", "ox++x++oo"],
])(
  "Given server had first move but can't win, should block player's winning move in %s as %s",
  async (input, expected) => {
    const request = {
      query: { board: input.replace(/\+/g, " ") },
    };

    await httpFunction(context, request);

    expect(context!.res!.status).toBe(200);
    expect(context!.res!.body).toBe(`${expected.replace(/\+/g, " ")}`);
  }
);
