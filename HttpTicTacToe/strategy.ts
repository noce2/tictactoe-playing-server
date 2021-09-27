import { Board, MovePosition } from "./board.model";
import { winningCombinations } from "./winningCombinations";

export function getServerMove(board: Board): MovePosition | null {
  if (hasPlayerWon(board)) {
    return null;
  }

  // 1. Attempt to win first
  const serversWinningNextMove = canEntityWin(board, "server");

  if (serversWinningNextMove.boolean) {
    return serversWinningNextMove.move;
  }

  // 2. Attempt to block players winning move
  const playersWinningNextMove = canEntityWin(board, "player");

  if (playersWinningNextMove.boolean) {
    return playersWinningNextMove.move;
  }

  const performedMoves = new Set([...board.playerMoves, ...board.serverMoves]);
  const possibleMovesLeft = (
    [0, 1, 2, 3, 4, 5, 6, 7, 8] as MovePosition[]
  ).filter((each) => !performedMoves.has(each));

  const randomMove =
    possibleMovesLeft[Math.floor(Math.random() * possibleMovesLeft.length)];
  return randomMove;
}

function canEntityWin(board: Board, entity: "player" | "server") {
  const movesToConsider =
    entity === "player" ? board.playerMoves : board.serverMoves;

  const alreadyMadeMoves = Array.from(movesToConsider);

  if (movesToConsider.size !== 2) {
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
