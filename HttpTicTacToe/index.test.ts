import httpFunction from "./index";
import context from "../tests/defaultContext";

test("Http trigger should return known text", async () => {
  const request = {
    query: { name: "Bill" },
  };

  await httpFunction(context, request);

  expect((context.log as unknown as jest.Mock).mock.calls.length).toBe(1);
  expect(context.res.body).toContain(`Hello, ${request.query.name}`);
});
