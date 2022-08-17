class TicTacToe {
    constructor() {
      this.gameType = 'TicTacToe';
      this.minPlayers = 2;
      this.maxPlayers = 4;
      this.isStarted = false;
              
      this.board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
      ];

      this.teamNames = ['Blue', 'Red'];
      this.teamInfo = {}; this.setupTeams();
      this.turn;
      this.winner;
    }

    setupTeams() {
      for (let i = 0; i < this.teamNames.length; i++) {
        this.teamInfo[this.teamNames[i]] = {};
        this.teamInfo[this.teamNames[i]]['teamsTally'] = 0;
      }
      // console.log(this)  // 'This' scoping gets messed up with for each? https://stackoverflow.com/questions/45175605/how-to-call-this-inside-for-example-foreach-in-class
      // this.teamNames.forEach(function(team) {
      //   console.log(this)
      //   this.teamInfo[team]['teamsTally] = 0;
      // });
    }

    assignTeam() {
      /* Assign team */

      let teamName = Math.random() < 0.5 ? this.teamNames[0] : this.teamNames[1];

      /* Tally assigned teams */
      this.teamInfo[teamName]['teamsTally'] += 1;

      return teamName;
    }

    joinTeam(teamName) {
      this.teamInfo[teamName]['teamsTally'] += 1;
    }

    leaveTeam(teamName) {
      this.teamInfo[teamName]['teamsTally'] -= 1;
    }

    canJoin() {
      let canJoin = true;
      
      return canJoin;
    }

    canStart() {
      let canStart = false;

      /* Check to make sure each team has players */
      let allTeamsHavePlayers = true;
      for (const [team, numOfPlayers] of Object.entries(this.teamInfo)) {
        if (this.teamInfo[team]['teamsTally'] === 0) { allTeamsHavePlayers = false; }
      }

      if (allTeamsHavePlayers) { canStart = true; }
      
      return canStart;
    }
  
    startGame() {
      this.turn = this.teamNames[0];
    }

    nextTurn() {
      let teamIndex = this.teamNames.indexOf(this.turn);
      if (teamIndex === this.teamNames.length-1) { this.turn = this.teamNames[0]; } else { this.turn = this.teamNames[teamIndex+1]; }
    }

    setWinner(winningTeamName) {
      this.winner = winningTeamName;
      this.turn = '';
    }

    placePiece(team, coords) {
      if (this.turn != team) { return; }
      if (this.board[coords[0]][coords[1]] != '') { return; }

      this.board[coords[0]][coords[1]] = team;

      this.nextTurn();
    }

    checkWin() {
      if (this.winner !== undefined) { return this.winner; }

      let numInARowToWin = 3;
      let directions = [[0,1], [1,1], [1,0], [1,-1]];
      for (let d = 0; d < directions.length; d++) {
        let dRow = directions[d][0];
        let dCol = directions[d][1];
        for (let i = 0; i < this.board.length; i++) {
          for (let j = 0; j < this.board[i].length; j++) {
            let boardRowLen = this.board[0].length;
            let boardColLen = this.board.length;
            let lastRow = i + (boardRowLen-1)*dRow;
            let lastCol = j + (boardColLen-1)*dCol;
            if (0 <= lastRow && lastRow <= (boardRowLen-1) && 0 <= lastCol && lastCol <= (boardColLen-1)) {
              let checkedSpots = [];
              for (let n = 0; n < numInARowToWin; n++) {
                let spot = this.board[i + (n*dRow)][j + (n*dCol)];
                checkedSpots.push(spot);
              }
              for (let n = 0; n < checkedSpots.length; n++) {
                if (checkedSpots[0] !== checkedSpots[n]) { break; }
                if (n === checkedSpots.length-1 && checkedSpots[0] !== '') { this.setWinner(checkedSpots[0]); return this.winner; }
              }
              // let current = this.board[i][j];
              // let next = this.board[i + dRow][j + dCol];
              // let final = this.board[i + (2*dRow)][j + (2*dCol)];
              // if (current == next && current == final && current !== '') { this.turn = ''; return current; }
            }
          }
        }
      }
      if (!this.board[0].includes('') && !this.board[1].includes('') && !this.board[2].includes('')) { this.setWinner('cat'); return this.winner; }
      return null;
    }

    getGameState(params) {
      let gameState = {};
      let gameboard = this.board;
      let turn = this.turn;
      let winner = this.checkWin();

      gameState = { 'gameboard': gameboard, 'turn': turn, 'winner': winner };
      return gameState;
    }
  
}

module.exports = TicTacToe;