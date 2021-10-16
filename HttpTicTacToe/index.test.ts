import httpFunction from "./index";
import context from "../tests/defaultContext";

beforeEach(() => {
  context.res = {};
});

describe("Board Validation", () => {
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

  test("should send bad request if board is full", async () => {
    const request = {
      query: { board: "xxooxoxox".replace(/\+/g, " ") },
    };

    await httpFunction(context, request);

    expect(context!.res!.status).toBe(400);
    expect(context!.res!.body).toContain("Board is full");
  });

  test("should send back same board if x wins", async () => {
    const request = {
      query: { board: "xxxo+++o+".replace(/\+/g, " ") },
    };

    await httpFunction(context, request);

    expect(context!.res!.status).toBe(200);
    expect(context!.res!.body).toBe(`${request.query.board}`);
  });
});

describe("Strategy: Server (o) winning", () => {
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

      const previousNumberOfServerMoves = [
        ...request.query.board.matchAll(/o/g),
      ].length;

      await httpFunction(context, request);

      expect(context!.res!.status).toBe(200);

      const currentNumberOfServerMoves = [
        ...(context!.res!.body as string).matchAll(/o/g),
      ].length;

      // Assert some move has been made.
      expect(currentNumberOfServerMoves).toBeGreaterThan(
        previousNumberOfServerMoves
      );
    }
  );
});

describe("Strategy: Block player (x) winning", () => {
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
});

describe("Strategy: Server (o) makes fork", () => {
  it.each([
    ["++xxo+o++", ["++xxo+o+o", "++xxo+oo+"]], // CASE A
    ["x+++o++xo", ["x+o+o++xo", "x+++oo+xo"]], // this is the CASE A rotated by 90 degrees anti-clockwise
    ["++o+oxx++", ["o+o+oxx++", "+oo+oxx++"]], // this is the CASE A rotated by 180 degrees anti-clockwise
    ["ox++o+++x", ["ox++o+o+x", "ox+oo+++x"]], // this is the CASE A rotated by 270 degrees anti-clockwise
    ["x+o+x+o++", ["x+o+x+o+o"]], // CASE B
    ["o+++x+x+o", ["o+o+x+x+o"]], // this is the CASE B rotated by 90 degrees anti-clockwise
    ["++o+x+o+x", ["o+o+x+o+x"]], // this is the CASE B rotated by 180 degrees anti-clockwise
    ["o+x+x+++o", ["o+x+x+o+o"]], // this is the CASE B rotated by 270 degrees anti-clockwise
  ])(
    "Given a fork can be made by server in %s, it should exploit it",
    async (input, possibles) => {
      const request = {
        query: { board: input.replace(/\+/g, " ") },
      };

      await httpFunction(context, request);

      expect(context!.res!.status).toBe(200);
      expect((context!.res!.body as string).replace(/\s/g, "+")).toBeOneOf(
        possibles
      );
    }
  );
});

describe("Strategy: Server (o) picks center", () => {
  test("should play in center if board is empty", async () => {
    const request = {
      query: { board: "+++++++++".replace(/\+/g, " ") },
    };

    await httpFunction(context, request);

    expect(context!.res!.status).toBe(200);
    expect(context!.res!.body).toBe(`${"++++o++++".replace(/\+/g, " ")}`);
  });
});
