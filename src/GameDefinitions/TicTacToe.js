class TicTacToe {
    constructor() {
      this.gameType = 'TicTacToe';
      this.minPlayers = 2;
      this.maxPlayers = 2;
      this.isStarted = false;
              
      this.board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
      ];

      this.teams = [];
      this.turn;
    }
  
    startGame() {
      this.turn = this.teams[0];
    }

    checkWin() {
      let directions = [[0,1], [1,1], [1,0], [1,-1]];
      for (let d = 0; d < directions.length; d++) {
        let dRow = directions[d][0];
        let dCol = directions[d][1];
        for (let i = 0; i < this.board.length; i++) {
          for (let j = 0; j < this.board[i].length; j++) {
            let lastRow = i + 2*dRow;
            let lastCol = j + 2*dCol;
            if (0 <= lastRow && lastRow <= 2 && 0 <= lastCol && lastCol <= 2) {
              let current = this.board[i][j];
              let next = this.board[i + dRow][j + dCol];
              let final = this.board[i + (2*dRow)][j + (2*dCol)];
              if (current == next && current == final && current !== '') { this.turn = ''; return current; }
            }
          }
        }
      }
      return null;
    }

    setPiece(team, coords) {
      if (this.turn != team) { return; }
      if (this.board[coords[0]][coords[1]] != '') { return; }

      this.board[coords[0]][coords[1]] = team;

      this.turn == this.teams[0] ? this.turn = this.teams[1] : this.turn = this.teams[0];
    }
  
}

module.exports = TicTacToe;