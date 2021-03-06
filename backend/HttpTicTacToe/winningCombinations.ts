import { MovePosition } from "./board.model";

export const winningCombinations = Object.freeze({
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

/* export const winningCombinations = new Map([
  [
    0 as MovePosition,
    new Map([
      [1, 2],
      [2, 1],
      [3, 6],
      [6, 3],
      [4, 8],
      [8, 4],
    ]) as Map<MovePosition, MovePosition>,
  ],
  [
    1 as MovePosition,
    new Map([
      [4, 7],
      [0, 2],
      [2, 0],
      [7, 4],
    ]) as Map<MovePosition, MovePosition>,
  ],
  [
    2 as MovePosition,
    new Map([
      [1, 0],
      [5, 8],
      [4, 6],
      [6, 4],
      [8, 5],
      [0, 1],
    ]) as Map<MovePosition, MovePosition>,
  ],
  [
    3 as MovePosition,
    new Map([
      [4, 5],
      [5, 4],
      [6, 0],
      [0, 6],
    ]) as Map<MovePosition, MovePosition>,
  ],
  [
    4 as MovePosition,
    new Map([
      [0, 8],
      [8, 0],
      [1, 7],
      [7, 1],
      [2, 6],
      [6, 2],
      [3, 5],
      [5, 3],
    ]) as Map<MovePosition, MovePosition>,
  ],
  [
    5 as MovePosition,
    new Map([
      [2, 8],
      [8, 2],
      [3, 4],
      [4, 3],
    ]) as Map<MovePosition, MovePosition>,
  ],
  [
    6 as MovePosition,
    new Map([
      [0, 3],
      [3, 0],
      [2, 4],
      [4, 2],
      [7, 8],
      [8, 7],
    ]) as Map<MovePosition, MovePosition>,
  ],
  [
    7 as MovePosition,
    new Map([
      [1, 4],
      [4, 1],
      [6, 8],
      [8, 6],
    ]) as Map<MovePosition, MovePosition>,
  ],
  [
    8 as MovePosition,
    new Map([
      [0, 4],
      [4, 0],
      [2, 5],
      [5, 2],
      [6, 7],
      [7, 6],
    ]) as Map<MovePosition, MovePosition>,
  ],
]);
 */
