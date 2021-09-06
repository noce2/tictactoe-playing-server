import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  const receivedBoard = req.query.board;
  const responseMessage = receivedBoard.split("");

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: responseMessage.map((each) => (each === "+" ? " " : each)).join(""),
  };
};

export default httpTrigger;
