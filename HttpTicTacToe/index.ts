import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { BoardValidationError, validateBoard } from "./boardValidation";
import { getServerMove } from "./strategy";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  try {
    if (!req.query?.board) {
      context.res = {
        status: 400,
        body: "no board sent",
      };
      return;
    }

    const receivedBoard = validateBoard(req.query.board);

    const nextMove = getServerMove(receivedBoard);

    if (!(nextMove === null)) {
      receivedBoard.playServerMove(nextMove);
    }

    const responseMessage = receivedBoard.board;

    context.res = {
      status: 200 /* Defaults to 200 */,
      body: responseMessage.join(""),
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
