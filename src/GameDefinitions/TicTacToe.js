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

      this.teams = ['Blue', 'Red'];
      this.teamsTally = {}; this.setupTeamsTally(); // { teamName: numOfTeamMembers [,... teamName: numOfTeamMembers] }
      this.turn;
    }

    setupTeamsTally() {
      for (let i = 0; i < this.teams.length; i++) {
        this.teamsTally[this.teams[i]] = 0;
      }
      // console.log(this)  // 'This' scoping gets messed up with for each? https://stackoverflow.com/questions/45175605/how-to-call-this-inside-for-example-foreach-in-class
      // this.teams.forEach(function(team) {
      //   console.log(this)
      //   this.teamsTally[team] = 0;
      // });
    }

    assignTeam() {
      /* Assign team */

      let teamName = Math.random() < 0.5 ? this.teams[0] : this.teams[1];

      /* Tally assigned teams */
      this.teamsTally[teamName] += 1;

      return teamName;
    }

    joinTeam(teamName) {
      this.teamsTally[teamName] += 1;
    }

    leaveTeam(teamName) {
      this.teamsTally[teamName] -= 1;
    }

    canJoin() {
      let canJoin = true;
      
      return canJoin;
    }

    canStart() {
      let canStart = false;

      /* Check to make sure each team has players */
      let allTeamsHavePlayers = true;
      for (const [team, numOfPlayers] of Object.entries(this.teamsTally)) {
        if (numOfPlayers === 0) { allTeamsHavePlayers = false; }
      }

      if (allTeamsHavePlayers) { canStart = true; }
      
      return canStart;
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
      if (!this.board[0].includes('') && !this.board[1].includes('') && !this.board[2].includes('')) { return 'cat'; }
      return null;
    }

    placePiece(team, coords) {
      if (this.turn != team) { return; }
      if (this.board[coords[0]][coords[1]] != '') { return; }

      this.board[coords[0]][coords[1]] = team;

      this.turn == this.teams[0] ? this.turn = this.teams[1] : this.turn = this.teams[0];
    }
  
}

module.exports = TicTacToe;