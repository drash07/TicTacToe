"use strict";

window.addEventListener('load', app);

let gameBoard = ['', '', '', '', '', '', '', '', '']; 
let turn = 0; // Keeps track if X or O player's turn
let winner = false;

// CREATE PLAYER
const player = (name, score) => {
  name = name;
  score = score;
  return {name, score};
 };

 let playerX = player("");
 let playerY = player("");

 // INITIALIZE APP
function app() {
  let inputField = document.querySelector('.input-field').focus();

  const addPlayerForm = document.getElementById('player-form');
  addPlayerForm.addEventListener('submit', addPlayers);

  let replayButton = document.querySelector('.replay-btn');
  replayButton.addEventListener('click', resetBoard);

  const goBackButton = document.querySelector('#go-back');
  goBackButton.addEventListener('click', goBack);
  goBackButton.style.display = 'none';
}

// Add PLAYERS
function addPlayers(event) {
  event.preventDefault();

  // alert on empty name field
  if (this.player1.value === '' || this.player2.value === '') {
    alert('You Must Enter a Name for Each Field');
    return;
  }

  // player names have to be different
  if(this.player1.value === this.player2.value) {
    alert('Player names must be different');
    return;
  }

  var regex = /^[A-Za-z]+$/;
  var isValid = regex.test(this.player1.value) && regex.test(this.player2.value);
  
  if (!isValid) {
    alert("Player name should only contain alphabetical characters (A-Z or a-z).");
    return;
  }

  const playerFormContainer = document.querySelector('.enter-players');
  const boardMain = document.querySelector('.board__main');
  const scoreBoard = document.querySelector('.score-board-container');
  const goBackButton = document.querySelector('#go-back');
  playerFormContainer.classList.add('hide-container');
  boardMain.classList.remove('hide-container');
  scoreBoard.classList.remove('hide-container');
  goBackButton.style.display = 'inline';

  playerX.name = this.player1.value.charAt(0).toUpperCase() + this.player1.value.slice(1);
  playerY.name = this.player2.value.charAt(0).toUpperCase() + this.player2.value.slice(1);
  playerX.score = 0;
  playerY.score = 0;

  // update the player names in the score board
  const player1_name = document.querySelector('.player1-name');
  const player2_name = document.querySelector('.player2-name');
  const score1 = document.querySelector('.score1');
  const score2 = document.querySelector('.score2');

  player1_name.innerText = playerX.name;
  player2_name.innerText = playerY.name;

  score1.innerText = playerX.score;
  score2.innerText = playerY.score;

  buildBoard();
}

// RETURN CURRENT PLAYER
function currentPlayer() {
  return turn % 2 === 0 ? 'X' : 'O';
}

// Resize squares in event browser is resized
window.addEventListener("resize", onResize);
function onResize() {
  let allCells = document.querySelectorAll('.board__cell');
  let cellHeight = allCells[0].offsetWidth;
  
  allCells.forEach( cell => {
    cell.style.height = `${cellHeight}px`;
  });
}

// Build Board
function buildBoard() {
  let resetContainer = document.querySelector('.reset');
  resetContainer.classList.remove('reset--hidden');

  onResize();
  addCellClickListener();
  changeBoardHeaderNames();
}

// CELL CLICK EVENT FOR PLAYER TO ATTEMPT TO MAKE MOVE
function makeMove(event) {
  console.log(turn);
  
  let currentCell = parseInt(event.currentTarget.firstElementChild.dataset.id);
  let cellToAddToken = document.querySelector(`[data-id='${currentCell}']`);
  
  if (cellToAddToken.innerHTML !== '') {
    console.log('This cell is already taken.');
    return;
  } else {
    if (currentPlayer() === 'X') {
      cellToAddToken.textContent = currentPlayer();
      gameBoard[currentCell] = 'X';
    } else {
      cellToAddToken.textContent = currentPlayer();
      gameBoard[currentCell] = 'O';
    }
  }
    
  // CHECK IF WE HAVE A WINNER
  isWinner();
    
  // Update turn count so next player can choose
  turn ++;

  // CHANGE BOARD HEADER INFO
  changeBoardHeaderNames();
}

function checkIfTie() {
  if (turn > 7) {
    alert('game over a tie')
  }
}

function isWinner() {
  const winningSequences = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  winningSequences.forEach( winningCombos => {
    let cell1 = winningCombos[0];
    let cell2 = winningCombos[1];
    let cell3 = winningCombos[2];
    if (
      gameBoard[cell1] === currentPlayer() &&
      gameBoard[cell2] === currentPlayer() &&
      gameBoard[cell3] === currentPlayer()
    ) {

      
      const cells = document.querySelectorAll('.board__cell');
      let letterId1 = document.querySelector(`[data-id='${cell1}']`);
      let letterId2 = document.querySelector(`[data-id='${cell2}']`);
      let letterId3 = document.querySelector(`[data-id='${cell3}']`);
      
      cells.forEach( cell => {
        let cellId = cell.firstElementChild.dataset.id;	

        if (cellId == cell1 || cellId == cell2 || cellId == cell3 ) {
          cell.classList.add('board__cell--winner');
        }
      });
      const score1 = document.querySelector('.score1');
      const score2 = document.querySelector('.score2');

      let currentPlayerText = document.querySelector('.board___player-turn');
      if (currentPlayer() === 'X') {
        currentPlayerText.innerHTML = `
          <div class="congratulations">Congratulations ${playerX.name}</div>
          <div class="u-r-winner">You are our winner for this round!</div>
        `;
        winner = true;
        playerX.score += 1;
        score1.innerText = playerX.score;
        removeCellClickListener();
        return true;
      } else {
        currentPlayerText.innerHTML = `
          <div class="congratulations">Congratulations ${playerY.name}</div>
          <div class="u-r-winner">You are our winner for this round!</div>
        `;
        winner = true;
        playerY.score += 1;
        score2.innerText = playerY.score;
        removeCellClickListener();
        return true;
      }
    }
  });

  if (!winner) {
    checkIfTie();
  }
  
  return false;
}

function changeBoardHeaderNames() {
  if (!winner) {
    let currentPlayerText = document.querySelector('.board___player-turn');
    if (currentPlayer() === 'X') {
      currentPlayerText.innerHTML = `
        <span class="name--style">${playerX.name}</span>, you are up!
        <div class="u-r-winner"></div>
      `
    }  else {
      currentPlayerText.innerHTML = `
        <span class="name--style">${playerY.name}</span>, you are up.
        <div class="u-r-winner"></div>
      `
    }
  }
}

function resetBoard() {
  console.log('resetting');
  
  gameBoard = ['', '', '', '', '', '', '', '', '']; 
  
  let cellToAddToken = document.querySelectorAll('.letter');
  cellToAddToken.forEach( square => {
    square.textContent = '';
    square.parentElement.classList.remove('board__cell--winner');
  });

  turn = 0;
  winner = false;

  let currentPlayerText = document.querySelector('.board___player-turn');
  currentPlayerText.innerHTML = `
    <span class="name--style">${playerX.name}</span>, you are up!
    <div class="u-r-winner"></div>
  `

  addCellClickListener();
}

function addCellClickListener() {
  const cells = document.querySelectorAll('.board__cell');
  cells.forEach( cell => {
    cell.addEventListener('click', makeMove);
  });
}

function removeCellClickListener() {
  let allCells = document.querySelectorAll('.board__cell');
  allCells.forEach( cell => {
    cell.removeEventListener('click', makeMove);
  });
}

//GO BACK
function goBack() {
  const playerFormContainer = document.querySelector('.enter-players');
  const scoreBoard = document.querySelector('.score-board-container');
  const boardMain = document.querySelector('.board__main');
  const goBackButton = document.querySelector('#go-back');
  let resetContainer = document.querySelector('.reset');
  const inputField = document.querySelectorAll('.input-field');
  playerFormContainer.classList.remove('hide-container');
  scoreBoard.classList.add('hide-container');
  boardMain.classList.add('hide-container');
  resetContainer.classList.add('reset--hidden');
  goBackButton.style.display = 'none';
  inputField.forEach((input) => {
    input.value = '';
  });
}
