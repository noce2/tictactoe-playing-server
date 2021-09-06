export class Board {
  playerSymbol = "x";
  private _playerTurns = 0;
  serverSymbol = "o";
  private _serverTurns = 0;
  private _board: string[] = [];

  constructor(boardString) {
    boardString.split("").forEach((symbol, index) => {
      this._board[index] = symbol;

      switch (symbol) {
        case this.playerSymbol:
          this.playerTurns++;
          break;
        case this.serverSymbol:
          this.serverTurns++;
          break;
        default:
          break;
      }
    });
  }

  public get playerTurns() {
    return this._playerTurns;
  }
  private set playerTurns(value) {
    this._playerTurns = value;
  }

  public get serverTurns() {
    return this._serverTurns;
  }
  private set serverTurns(value) {
    this._serverTurns = value;
  }

  public playServerMove(index: number) {
    this._serverTurns++;
    this.board[index] = this.serverSymbol;
  }

  public get board(): string[] {
    return this._board;
  }
}
