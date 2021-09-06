export class Board {
  playerSymbol = "x";
  private _playerMoves: Set<MovePosition> = new Set();
  serverSymbol = "o";
  private _serverMoves: Set<MovePosition> = new Set();
  private _board: string[] = [];

  constructor(boardString) {
    boardString.split("").forEach((symbol, index) => {
      this._board[index] = symbol;

      switch (symbol) {
        case this.playerSymbol:
          this._playerMoves.add(index);
          break;
        case this.serverSymbol:
          this._serverMoves.add(index);
          break;
        default:
          break;
      }
    });
  }

  public get playerTurns() {
    return this._playerMoves.size;
  }

  public get serverTurns() {
    return this._serverMoves.size;
  }

  public playServerMove(index: MovePosition) {
    this._serverMoves.add(index);
    this.board[index] = this.serverSymbol;
  }

  public get board(): string[] {
    return this._board;
  }
}

export type MovePosition = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
