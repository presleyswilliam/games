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

      this.teamNames = ['Blue', 'Red', 'Green'];
      this.teamInfo = {}; this.setupTeams();
      this.turn;
      this.winner = null;
      this.sequencesNeededToWin = 2;

      this.lastPlacedCoords = {};
    }

    setupTeams() {
      for (let i = 0; i < this.teamNames.length; i++) {
        this.teamInfo[this.teamNames[i]] = {};
        this.teamInfo[this.teamNames[i]]['teamsTally'] = 0;
        this.teamInfo[this.teamNames[i]]['hand'] = [];
        this.teamInfo[this.teamNames[i]]['selectedCardIndex'] = null;
        this.teamInfo[this.teamNames[i]]['sequences'] = 0;
      }
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
      let teamsWithPlayers = [];
      for (const [team, teamInfoValues] of Object.entries(this.teamInfo)) {
        if (this.teamInfo[team]['teamsTally'] !== 0) { teamsWithPlayers.push(team); }
      }

      if (teamsWithPlayers.length >= 2) { canStart = true; }
      
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

        // this.deck = ['black_joker','6_diamonds','7_diamonds','8_diamonds','9_diamonds','10_diamonds','Q_diamonds','K_diamonds','A_diamonds','black_joker',
        //               '5_diamonds','3_hearts','2_hearts','2_spades'];

      this.shuffle1DArray(this.deck);

      for (const [team, teamInfoValues] of Object.entries(this.teamInfo)) {
        /* Remove empty team */
        if (this.teamInfo[team]['teamsTally'] === 0) {
          let emptyTeamIndex = this.teamNames.indexOf(team);
          this.teamNames.splice(emptyTeamIndex, 1);
          delete this.teamInfo[team];
          continue;
        }

        /* Set up hands for players */
        this.teamInfo[team]['hand'] = [this.deck.pop(), this.deck.pop(), this.deck.pop(), this.deck.pop(), this.deck.pop(), this.deck.pop(), this.deck.pop()];


      }

      if (this.teamNames.length > 2) { this.sequencesNeededToWin = 1; }

      this.turn = this.teamNames[0];
    }

    nextTurn() {
      let teamIndex = this.teamNames.indexOf(this.turn);
      if (teamIndex === this.teamNames.length-1) { this.turn = this.teamNames[0]; } else { this.turn = this.teamNames[teamIndex+1]; }
    }

    swapCard(team, handIndex) {
      this.teamInfo[team]['hand'].splice(handIndex, 1);
      if (this.deck.length > 0) { this.teamInfo[team]['hand'].push(this.deck.pop()); }
    }

    readyHandCard(team, handIndex) {
      if (this.teamInfo[team]['selectedCardIndex'] === null) {
        this.teamInfo[team]['selectedCardIndex'] = handIndex;
        return true;
      } else {
        this.teamInfo[team]['selectedCardIndex'] = null;
        return true;
      }
    }

    selectHandCard(team, handIndex) {
      if (this.teamInfo[team]['selectedCardIndex'] === handIndex) {
        this.teamInfo[team]['selectedCardIndex'] = null;
        this.swapHandCard(team, handIndex);
      } else {
        this.teamInfo[team]['selectedCardIndex'] = handIndex;
      }
    }

    swapHandCard(team, handIndex) {
      let handCardRank = this.teamInfo[team]['hand'][handIndex];
      if (handCardRank === 'J_twoEyed' || handCardRank === 'J_oneEyed') { return; }

      let foundArray = [];
      for (let i = 0; i < this.board.length; i++) {
        for (let j = 0; j < this.board[i].length; j++) {
          if (this.boardLayout[i][j] === handCardRank && this.board[i][j] !== '') { foundArray.push(i + '_' + j); }
        }
      }
      if (foundArray.length === 2) { this.swapCard(team, handIndex); return true; }
      // let rowIndex = this.boardLayout.findIndex(row => row.includes(handCardRank));
      // let colIndex = this.boardLayout[rowIndex].indexOf(handCardRank);
      // console.log(this.board[rowIndex][colIndex])
    }

    placePiece(team, coords) {
      if (this.turn != team) { return; }

      let boardCardRank = this.board[coords['boardCoords'][0]][coords['boardCoords'][1]];
      let handCardRank = this.teamInfo[team]['hand'][coords['handIndex']];
      if (boardCardRank !== '' && handCardRank !== 'J_oneEyed') { return; } // If spot is already taken and not using remove jack
      if (handCardRank === 'J_oneEyed' && (boardCardRank === '' || boardCardRank === team || boardCardRank.split('_S').length > 1)) { return; } // If using remove jack but the spot is empty, your own token, or a sequence

      if (handCardRank === 'J_oneEyed') { this.board[coords['boardCoords'][0]][coords['boardCoords'][1]] = ''; }
      else { this.board[coords['boardCoords'][0]][coords['boardCoords'][1]] = team; }

      this.lastPlacedCoords = { 'row': coords['boardCoords'][0], 'col': coords['boardCoords'][1] };

      this.swapCard(team, coords['handIndex']);

      this.teamInfo[team]['selectedCardIndex'] = null;

      this.nextTurn();
    }

    tallySequencesForWinner(teamName) {
      this.teamInfo[teamName]['sequences'] += 1;
      if (this.teamInfo[teamName]['sequences'] === this.sequencesNeededToWin) { this.winner = teamName; this.turn = ''; return this.winner; }
      return null;
    }

    checkWin() {
      /* Winner already defined */
      if (this.winner !== null) { return this.winner; }

      /* Checking if players have cards in hand */
      let anyTeamHasCards = false;
      for (const [team, teamInfoValues] of Object.entries(this.teamInfo)) {
        if (this.teamInfo[team]['hand'].length !== 0) { anyTeamHasCards = true; }
      }
      if (anyTeamHasCards === false) { this.winner = 'cat'; return this.winner; }
      
      let directions = [[0,1], [1,1], [1,0], [1,-1]];
      for (let d = 0; d < directions.length; d++) {
        let dRow = directions[d][0];
        let dCol = directions[d][1];
        for (let i = 0; i < this.board.length; i++) {
          for (let j = 0; j < this.board[i].length; j++) {
            let lastRow = i + 4*dRow;
            let lastCol = j + 4*dCol;
            if (0 <= lastRow && lastRow <= 9 && 0 <= lastCol && lastCol <= 9) {
              let current = this.board[i][j];
              for (let n = 0; n < this.teamNames.length; n++) {
                let team = this.teamNames[n];
                if (current == team && current == this.board[i + dRow][j + dCol] && current == this.board[i + (2*dRow)][j + (2*dCol)] && current == this.board[i + (3*dRow)][j + (3*dCol)] && current == this.board[lastRow][lastCol]) {
                  this.board[i][j] = team + '_S';
                  this.board[i + dRow][j + dCol] = team + '_S';
                  this.board[i + (2*dRow)][j + (2*dCol)] = team + '_S';
                  this.board[i + (3*dRow)][j + (3*dCol)] = team + '_S';
                  this.board[lastRow][lastCol] = team + '_S';
                  return this.tallySequencesForWinner(team);
      
                  // if (color == "blue") {
                  //   blueScore = blueScore + 1;
                  // } else if (color == "red") {
                  //   redScore = redScore + 1;
                  // }
      
                }
              }
            }
    
          } //end inner for
        } //end outer for
      } //end direction
      return null;
    }

    getGameState(params) {
      let gameState = {};
      let gameboard = this.board;
      let turn = this.turn;
      let winner = this.checkWin();
      let lastPlacedCoords = this.lastPlacedCoords;
      let hand = this.teamInfo[params.teamName]['hand'];
      let selectedCardIndex = this.teamInfo[params.teamName]['selectedCardIndex'];

      gameState = { 'gameboard': gameboard, 'turn': turn, 'winner': winner, 'lastPlacedCoords': lastPlacedCoords, 'hand': hand, 'selectedCardIndex': selectedCardIndex };
      return gameState;
    }
  
}

module.exports = Sequence;