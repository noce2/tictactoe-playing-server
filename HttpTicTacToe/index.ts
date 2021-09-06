import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { BoardValidationError, validateBoard } from "./boardValidation";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  try {
    const receivedBoard = validateBoard(req.query.board);
    const responseMessage = receivedBoard.board;

    context.res = {
      status: 200 /* Defaults to 200 */,
      body: responseMessage.map((each) => (each === "+" ? " " : each)).join(""),
    };
  } catch (err) {
    if (err instanceof BoardValidationError) {
      context.log(err);
      context.res = {
        status: 400,
        body: err.message,
      };
    } else {
      context.log(err);
      context.res = {
        status: 500,
        body: err.message ?? "Internal Server Error",
      };
    }
  }
};

export default httpTrigger;
