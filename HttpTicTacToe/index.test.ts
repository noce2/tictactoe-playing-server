import httpFunction from "./index";
import context from "../tests/defaultContext";

test("Http trigger should process a valid board", async () => {
  const request = {
    query: { board: "+xxo++o++" },
  };

  await httpFunction(context, request);

  expect(context.res.body).toContain(
    `${request.query.board.replace(/\+/g, " ")}`
  );
});

test("Http trigger should send bad request if board has too few chars", async () => {
  const request = {
    query: { board: "+xxo++o+" },
  };

  await httpFunction(context, request);

  expect(context.res.status).toBe(400);
  expect(context.res.body).toContain("Invalid board length");
});

test("Http trigger should send bad request if board chars outside expected", async () => {
  const request = {
    query: { board: "+xxoR++o+" },
  };

  await httpFunction(context, request);

  expect(context.res.status).toBe(400);
  expect(context.res.body).toContain("Invalid character in board");
});

test("Http trigger should send bad request if it is not server's turn", async () => {
  const request = {
    query: { board: "+x+o+++o+" },
  };

  await httpFunction(context, request);

  expect(context.res.status).toBe(400);
  expect(context.res.body).toContain("Not server's turn");
});
