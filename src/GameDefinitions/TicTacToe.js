class TicTacToe {
    constructor() {
      this.gameType = 'TicTacToe';
      this.isStarted = false;
              
      this.board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
      ];

      this.turn;
  
      this.startGame();
    }
  
    startGame() {
      this.turn = Math.random() < 0.5 ? "blue" : "red";
    }
  
}

module.exports = TicTacToe;