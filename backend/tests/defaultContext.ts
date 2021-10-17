import { Context } from "@azure/functions";

export default {
  log: jest.fn(),
  res: {} as {
    [key: string]: any;
  },
} as unknown as Context;
