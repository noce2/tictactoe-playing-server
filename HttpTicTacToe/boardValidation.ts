export function validateBoard(receivedBoardString: string) {
  if (receivedBoardString.length !== 9) {
    throw new BoardValidationError("Invalid board length");
  }

  if (/[^ox\+]/.test(receivedBoardString)) {
    throw new BoardValidationError("Invalid character in board");
  }
  return receivedBoardString;
}

export class BoardValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}
