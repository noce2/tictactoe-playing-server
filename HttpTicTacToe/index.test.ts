import httpFunction from "./index";
import context from "../tests/defaultContext";

test("Http trigger should process a valid board", async () => {
  const request = {
    query: { board: "+xxo++o++".replace(/\+/g, " ") },
  };

  await httpFunction(context, request);

  expect(context.res.status).toBe(200);
  expect(context.res.body).toContain(`${request.query.board}`);
});

test("Http trigger should send bad request if board has too few chars", async () => {
  const request = {
    query: { board: "+xxo++o+".replace(/\+/g, " ") },
  };

  await httpFunction(context, request);

  expect(context.res.status).toBe(400);
  expect(context.res.body).toContain("Invalid board length");
});

test("Http trigger should send bad request if board chars outside expected", async () => {
  const request = {
    query: { board: "+xxoR++o+".replace(/\+/g, " ") },
  };

  await httpFunction(context, request);

  expect(context.res.status).toBe(400);
  expect(context.res.body).toContain("Invalid character in board");
});

test("Http trigger should send bad request if it is not server's turn", async () => {
  const request = {
    query: { board: "+x+o+++o+".replace(/\+/g, " ") },
  };

  await httpFunction(context, request);

  expect(context.res.status).toBe(400);
  expect(context.res.body).toContain("Not server's turn");
});

test("Http trigger should send back same board if x wins", async () => {
  const request = {
    query: { board: "xxxo+++o+".replace(/\+/g, " ") },
  };

  await httpFunction(context, request);

  expect(context.res.status).toBe(200);
  expect(context.res.body).toBe(`${request.query.board}`);
});

test("Http trigger should send winning move if server can win", async () => {
  const request = {
    query: { board: "oo++++xx+".replace(/\+/g, " ") },
  };

  await httpFunction(context, request);

  expect(context.res.status).toBe(200);
  expect(context.res.body).toBe(`${"ooo+++xx+".replace(/\+/g, " ")}`);
});
