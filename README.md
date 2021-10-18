# TicTacToe Playing Server

## How It Works

The server implements the optimal play algorithm from [Wikipedia](https://en.wikipedia.org/wiki/Tic-tac-toe#Strategy), always playing as `o`.

1. Win: If the player has two in a row, they can place a third to get three in a row.
2. Block: If the opponent has two in a row, the player must play the third themselves to block
   the opponent.
3. Fork: Create an opportunity where the player has two ways to win (two non-blocked lines of 2).
4. Blocking an opponent's fork: If there is only one possible fork for the opponent, the player
   should block it. Otherwise, the player should block all forks in any way that simultaneously
   allows them to create two in a row. Otherwise, the player should create a two in a row to force
   the opponent into defending, as long as it doesn't result in them creating a fork. For example,
   if "X" has two opposite corners and "O" has the center, "O" must not play a corner move in order
   to win. (Playing a corner move in this scenario creates a fork for "X" to win.)
5. Center: A player marks the center. (If it is the first move of the game, playing a corner
   move gives the second player more opportunities to make a mistake and may therefore be the
   better choice; however, it makes no difference between perfect players.)
6. Opposite corner: If the opponent is in the corner, the player plays the opposite corner.
7. Empty corner: The player plays in a corner square.
8. Empty side: The player plays in a middle square on any of the 4 sides.

## Testing

### Local

1. `cd backend && npm start`
2. `curl http://localhost:7071/api/HttpTicTacToe?board=x++++++++`

### Deployed

`curl https://noce2-tictactoe-api.azurewebsites.net/api/HttpTicTacToe?board=x++++++++`
