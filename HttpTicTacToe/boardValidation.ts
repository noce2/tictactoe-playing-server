export function validateBoard(receivedBoardString: string) {
  if (receivedBoardString.length !== 9) {
    throw new BoardValidationError("Invalid board length");
  }
  return receivedBoardString;
}

export class BoardValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}
