import { Board } from "./board.model";

export function validateBoard(receivedBoardString: string): Board {
  if (receivedBoardString.length !== 9) {
    throw new BoardValidationError("Invalid board length");
  }

  if (/[^ox\s]/.test(receivedBoardString)) {
    throw new BoardValidationError("Invalid character in board");
  }

  const boardToReturn = parseBoardState(receivedBoardString);

  if (boardToReturn.playerTurns < boardToReturn.serverTurns) {
    throw new BoardValidationError("Not server's turn");
  }
  return boardToReturn;
}

export function isServersTurn(boardString) {}

export function parseBoardState(boardString): Board {
  const board = new Board(boardString);
  return board;
}

export class BoardValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}
