import { Board, MovePosition } from "./board.model";
import { winningCombinations } from "./winningCombinations";

export function getServerMove(board: Board): MovePosition | null {
  if (hasPlayerWon(board)) {
    return null;
  }

  /**
   * Strategy coming from:
   * https://en.wikipedia.org/wiki/Tic-tac-toe#Strategy
   */

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

  // 5. Center
  if (board.canMoveBeMade(4)) {
    return 4;
  }

  // Try anything as a fallback
  return nextRandomMove(board);
}

function canEntityWin(board: Board, entity: "player" | "server") {
  const movesToConsider =
    entity === "player" ? board.playerMoves : board.serverMoves;

  const alreadyMadeMoves = Array.from(movesToConsider);

  if (movesToConsider.size !== 2) {
    return { boolean: false, move: null };
  } else {
    const possibleWinningMove =
      winningCombinations[alreadyMadeMoves[0]]?.[alreadyMadeMoves[1]];
    if (
      possibleWinningMove !== undefined &&
      board.canMoveBeMade(possibleWinningMove)
    ) {
      return { boolean: true, move: possibleWinningMove };
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

function nextRandomMove(board): MovePosition {
  const performedMoves = new Set([...board.playerMoves, ...board.serverMoves]);
  const possibleMovesLeft = (
    [0, 1, 2, 3, 4, 5, 6, 7, 8] as MovePosition[]
  ).filter((each) => !performedMoves.has(each));

  const randomMove =
    possibleMovesLeft[Math.floor(Math.random() * possibleMovesLeft.length)];
  return randomMove;
}
