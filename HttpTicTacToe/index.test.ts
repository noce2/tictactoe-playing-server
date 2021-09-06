import httpFunction from "./index";
import context from "../tests/defaultContext";

test("Http trigger should return known text", async () => {
  const request = {
    query: { board: "+xxo++o++" },
  };

  await httpFunction(context, request);

  expect((context.log as unknown as jest.Mock).mock.calls.length).toBe(1);
  expect(context.res.body).toContain(
    `${request.query.board.replace(/\+/g, " ")}`
  );
});
