export class Board {
  playerSymbol = "x";
  playerMoves: Set<MovePosition> = new Set();
  serverSymbol = "o";
  serverMoves: Set<MovePosition> = new Set();
  private _board: string[] = [];

  constructor(boardString) {
    boardString.split("").forEach((symbol, index) => {
      this._board[index] = symbol;

      switch (symbol) {
        case this.playerSymbol:
          this.playerMoves.add(index);
          break;
        case this.serverSymbol:
          this.serverMoves.add(index);
          break;
        default:
          break;
      }
    });
  }

  public get playerTurns() {
    return this.playerMoves.size;
  }

  public get serverTurns() {
    return this.serverMoves.size;
  }

  public playServerMove(index: MovePosition) {
    if (this.board[index] === " ") {
      this.serverMoves.add(index);
      this.board[index] = this.serverSymbol;
    } else {
      throw new Error("Box already filled.");
    }
  }

  public get board(): string[] {
    return this._board;
  }
}

export type MovePosition = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
