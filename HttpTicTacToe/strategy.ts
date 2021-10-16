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

  // 3. Attempt to create a fork
  const serversForkMove = canEntityCreateFork(board, "server");
  if (serversForkMove.boolean) {
    return serversForkMove.move;
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

function canEntityCreateFork(
  board: Board,
  entity: "player" | "server"
): { boolean: boolean; move: MovePosition | null } {
  const numberOfMovesCurrently =
    entity === "player" ? board.playerMoves.size : board.serverMoves.size;

  if (numberOfMovesCurrently < 2) {
    return {
      boolean: false,
      move: null,
    };
  }

  const histogramOfMovesRemaining =
    createHistogramOfWinningMovesRemainingForPlayer(board, entity);

  const tupleOfMoveAndMaxOccurence = [
    ...histogramOfMovesRemaining.entries(),
  ].reduce(
    (previousMax, currentTuple) => {
      if (previousMax[1] && previousMax[1] > currentTuple[1]) {
        return previousMax;
      } else {
        return currentTuple;
      }
    },
    [null, 0]
  );

  if (tupleOfMoveAndMaxOccurence[0] === null) {
    return {
      boolean: false,
      move: null,
    };
  }
  return {
    boolean: true,
    move: tupleOfMoveAndMaxOccurence[0] as MovePosition,
  };
}

function createHistogramOfWinningMovesRemainingForPlayer(
  board: Board,
  entity: "player" | "server",
  combos = winningCombinations
): Map<MovePosition, number> {
  let result: Map<MovePosition, number> = new Map([]);

  const movesToCheck =
    entity === "server" ? board.serverMoves : board.playerMoves;

  for (const each of movesToCheck) {
    Object.entries(combos[each]).forEach(
      ([secondEntryInWinningComboTrie, thirdEntryInWinningComboTrie]) => {
        const secondEntryInWinningComboTrieAsMovePosition = parseInt(
          secondEntryInWinningComboTrie,
          10
        ) as MovePosition;
        if (
          board.canMoveBeMade(secondEntryInWinningComboTrieAsMovePosition) &&
          board.canMoveBeMade(thirdEntryInWinningComboTrie as MovePosition)
        ) {
          if (
            result.get(secondEntryInWinningComboTrieAsMovePosition) ===
            undefined
          ) {
            result.set(secondEntryInWinningComboTrieAsMovePosition, 1);
          } else if (
            result.get(secondEntryInWinningComboTrieAsMovePosition) !==
            undefined
          ) {
            result.set(
              secondEntryInWinningComboTrieAsMovePosition,
              result.get(secondEntryInWinningComboTrieAsMovePosition)! + 1
            );
          }
          if (
            result.get(thirdEntryInWinningComboTrie as MovePosition) ===
            undefined
          ) {
            result.set(thirdEntryInWinningComboTrie as MovePosition, 1);
          } else if (
            result.get(thirdEntryInWinningComboTrie as MovePosition) !==
            undefined
          ) {
            result.set(
              thirdEntryInWinningComboTrie as MovePosition,
              result.get(thirdEntryInWinningComboTrie as MovePosition)! + 1
            );
          }
        }
      }
    );
  }

  return result;
}
