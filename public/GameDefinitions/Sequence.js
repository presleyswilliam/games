class Sequence {
    constructor() {
      this.gameType = 'Sequence';
      this.isStarted = false;
      this.deck = ['black_joker','6_diamonds','7_diamonds','8_diamonds','9_diamonds','10_diamonds','Q_diamonds','K_diamonds','A_diamonds','black_joker',
                    '5_diamonds','3_hearts','2_hearts','2_spades','3_spades','4_spades','5_spades','6_spades','7_spades','A_clubs',
                    '4_diamonds','4_hearts','K_diamonds','A_diamonds','A_clubs','K_clubs','Q_clubs','10_clubs','8_spades','K_clubs',
                    '3_diamonds','5_hearts','Q_diamonds','Q_hearts','10_hearts','9_hearts','8_hearts','9_clubs','9_spades','Q_clubs',
                    '2_diamonds','6_hearts','10_diamonds','K_hearts','3_hearts','2_hearts','7_hearts','8_clubs','10_spades','10_clubs',
                    'A_spades','7_hearts','9_diamonds','A_hearts','4_hearts','5_hearts','6_hearts','7_clubs','Q_spades','9_clubs',
                    'K_spades','8_hearts','8_diamonds','2_clubs','3_clubs','4_clubs','5_clubs','6_clubs','K_spades','8_clubs',
                    'Q_spades','9_hearts','7_diamonds','6_diamonds','5_diamonds','4_diamonds','3_diamonds','2_diamonds','A_spades','7_clubs',
                    '10_spades','10_hearts','Q_hearts','K_hearts','A_hearts','2_clubs','3_clubs','4_clubs','5_clubs','6_clubs',
                    'black_joker','9_spades','8_spades','7_spades','6_spades','5_spades','4_spades','3_spades','2_spades','black_joker',
                    'J_twoEyed', 'J_twoEyed', 'J_twoEyed', 'J_twoEyed', 'J_oneEyed', 'J_oneEyed', 'J_oneEyed', 'J_oneEyed'];
              
      this.boardLayout = [ // Blue Layout
        ['black_joker','6_diamonds','7_diamonds','8_diamonds','9_diamonds','10_diamonds','Q_diamonds','K_diamonds','A_diamonds','black_joker'],
        ['5_diamonds','3_hearts','2_hearts','2_spades','3_spades','4_spades','5_spades','6_spades','7_spades','A_clubs'],
        ['4_diamonds','4_hearts','K_diamonds','A_diamonds','A_clubs','K_clubs','Q_clubs','10_clubs','8_spades','K_clubs'],
        ['3_diamonds','5_hearts','Q_diamonds','Q_hearts','10_hearts','9_hearts','8_hearts','9_clubs','9_spades','Q_clubs'],
        ['2_diamonds','6_hearts','10_diamonds','K_hearts','3_hearts','2_hearts','7_hearts','8_clubs','10_spades','10_clubs'],
        ['A_spades','7_hearts','9_diamonds','A_hearts','4_hearts','5_hearts','6_hearts','7_clubs','Q_spades','9_clubs'],
        ['K_spades','8_hearts','8_diamonds','2_clubs','3_clubs','4_clubs','5_clubs','6_clubs','K_spades','8_clubs'],
        ['Q_spades','9_hearts','7_diamonds','6_diamonds','5_diamonds','4_diamonds','3_diamonds','2_diamonds','A_spades','7_clubs'],
        ['10_spades','10_hearts','Q_hearts','K_hearts','A_hearts','2_clubs','3_clubs','4_clubs','5_clubs','6_clubs'],
        ['black_joker','9_spades','8_spades','7_spades','6_spades','5_spades','4_spades','3_spades','2_spades','black_joker']
      ];

      this.board = [
        ['','','','','','','','','',''],
        ['','','','','','','','','',''],
        ['','','','','','','','','',''],
        ['','','','','','','','','',''],
        ['','','','','','','','','',''],
        ['','','','','','','','','',''],
        ['','','','','','','','','',''],
        ['','','','','','','','','',''],
        ['','','','','','','','','',''],
        ['','','','','','','','','',''],
      ];

      this.teams = ['Blue', 'Red']; // needs green
      this.teamsTally = {}; this.setupTeamsTally(); // { teamName: numOfTeamMembers [,... teamName: numOfTeamMembers] }
      this.turn;
    }

    setupTeamsTally() {
      for (let i = 0; i < this.teams.length; i++) {
        this.teamsTally[this.teams[i]] = 0;
      }
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

    shuffle1DArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
      }
  
    startGame() {
      this.deck = ['black_joker','6_diamonds','7_diamonds','8_diamonds','9_diamonds','10_diamonds','Q_diamonds','K_diamonds','A_diamonds','black_joker',
                    '5_diamonds','3_hearts','2_hearts','2_spades','3_spades','4_spades','5_spades','6_spades','7_spades','A_clubs',
                    '4_diamonds','4_hearts','K_diamonds','A_diamonds','A_clubs','K_clubs','Q_clubs','10_clubs','8_spades','K_clubs',
                    '3_diamonds','5_hearts','Q_diamonds','Q_hearts','10_hearts','9_hearts','8_hearts','9_clubs','9_spades','Q_clubs',
                    '2_diamonds','6_hearts','10_diamonds','K_hearts','3_hearts','2_hearts','7_hearts','8_clubs','10_spades','10_clubs',
                    'A_spades','7_hearts','9_diamonds','A_hearts','4_hearts','5_hearts','6_hearts','7_clubs','Q_spades','9_clubs',
                    'K_spades','8_hearts','8_diamonds','2_clubs','3_clubs','4_clubs','5_clubs','6_clubs','K_spades','8_clubs',
                    'Q_spades','9_hearts','7_diamonds','6_diamonds','5_diamonds','4_diamonds','3_diamonds','2_diamonds','A_spades','7_clubs',
                    '10_spades','10_hearts','Q_hearts','K_hearts','A_hearts','2_clubs','3_clubs','4_clubs','5_clubs','6_clubs',
                    'black_joker','9_spades','8_spades','7_spades','6_spades','5_spades','4_spades','3_spades','2_spades','black_joker',
                    'J_twoEyed', 'J_twoEyed', 'J_twoEyed', 'J_twoEyed', 'J_oneEyed', 'J_oneEyed', 'J_oneEyed', 'J_oneEyed'];
      
      this.shuffle1DArray(this.deck);
    }

    placePiece(team, coords) {
      // if (this.turn != team) { return; }
      // if (this.board[coords[0]][coords[1]] != '') { return; }

      this.board[coords[0]][coords[1]] = team;

      // this.turn == this.teams[0] ? this.turn = this.teams[1] : this.turn = this.teams[0];
    }

    checkWin(color, placedVal, crownedVal) {
      return null;
      let directions = [[0,1], [1,1], [1,0], [1,-1]];
      for (let d = 0; d < directions.length; d++) {
        let dRow = directions[d][0];
        let dCol = directions[d][1];
        for (let i = 0; i < boardState.length; i++) {
          for (let j = 0; j < boardState[i].length; j++) {
            let lastRow = i + 4*dRow;
            let lastCol = j + 4*dCol;
            if (0 <= lastRow && lastRow <= 9 && 0 <= lastCol && lastCol <= 9) {
              let current = boardState[i][j];
              if (current == placedVal && current == boardState[i + dRow][j + dCol] && current == boardState[i + (2*dRow)][j + (2*dCol)] && current == boardState[i + (3*dRow)][j + (3*dCol)] && current == boardState[lastRow][lastCol]) {
                boardState[i][j] = crownedVal;
                boardState[i + dRow][j + dCol] = crownedVal;
                boardState[i + (2*dRow)][j + (2*dCol)] = crownedVal;
                boardState[i + (3*dRow)][j + (3*dCol)] = crownedVal;
                boardState[lastRow][lastCol] = crownedVal;
    
                if (color == "blue") {
                  blueScore = blueScore + 1;
                } else if (color == "red") {
                  redScore = redScore + 1;
                }
    
              }
            }
    
          } //end inner for
        } //end outer for
      } //end direction
    
    }
  
}

module.exports = Sequence;