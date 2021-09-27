import { Board, MovePosition } from "./board.model";
import { winningCombinations } from "./winningCombinations";

export function getServerMove(board: Board): MovePosition | null {
  if (hasPlayerWon(board)) {
    return null;
  }
  const winningNextMove = canServerWin(board);

  if (winningNextMove.boolean) {
    return winningNextMove.move;
  }

  const performedMoves = new Set([...board.playerMoves, ...board.serverMoves]);
  const possibleMovesLeft = (
    [0, 1, 2, 3, 4, 5, 6, 7, 8] as MovePosition[]
  ).filter((each) => !performedMoves.has(each));

  const randomMove =
    possibleMovesLeft[Math.floor(Math.random() * possibleMovesLeft.length)];
  return randomMove;
}

function canServerWin(board: Board): {
  boolean: boolean;
  move: MovePosition | null;
} {
  const alreadyMadeMoves = Array.from(board.serverMoves);

  if (board.serverMoves.size !== 2) {
    return { boolean: false, move: null };
  } else {
    const winningMove: number | undefined =
      winningCombinations[alreadyMadeMoves[0]]?.[alreadyMadeMoves[1]];
    if (winningMove !== undefined) {
      return { boolean: true, move: winningMove as MovePosition };
    } else {
      return { boolean: false, move: null };
    }
  }
}

function hasPlayerWon(board: Board): boolean {
  const alreadyMadeMoves = Array.from(board.playerMoves);

  if (board.playerMoves.size !== 3) {
    return false;
  } else {
    const winningMove =
      winningCombinations[alreadyMadeMoves[0]]?.[alreadyMadeMoves[1]] ===
      alreadyMadeMoves[2];
    if (winningMove) {
      return true;
    } else {
      return false;
    }
  }
}
