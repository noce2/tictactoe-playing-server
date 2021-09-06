import { Board, MovePosition } from "./board.model";

const winningCombinations = Object.freeze({
  0: {
    1: 2,
    2: 1,
    3: 6,
    6: 3,
    4: 8,
    8: 4,
  },
  1: {
    4: 7,
    0: 2,
    2: 0,
    7: 4,
  },
  2: {
    1: 0,
    5: 8,
    4: 6,
    6: 4,
    8: 5,
    0: 1,
  },
  3: {
    4: 5,
    5: 4,
    6: 0,
    0: 6,
  },
  4: {
    0: 8,
    8: 0,
    1: 7,
    7: 1,
    2: 6,
    6: 2,
    3: 5,
    5: 3,
  },
  5: {
    2: 8,
    8: 2,
    3: 4,
    4: 3,
  },
  6: {
    0: 3,
    3: 0,
    2: 4,
    4: 2,
    7: 8,
    8: 7,
  },
  7: {
    1: 4,
    4: 1,
    6: 8,
    8: 6,
  },
  8: {
    0: 4,
    4: 0,
    2: 5,
    5: 2,
    6: 7,
    7: 6,
  },
});

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
    const winningMove =
      winningCombinations[alreadyMadeMoves[0]]?.[alreadyMadeMoves[1]];
    if (winningMove) {
      return { boolean: true, move: winningMove };
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
