const ROWS = 6;
const COLS = 7;
let currentPlayer = 'red';
let gameOver = false;
const board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));//create 2 d array to creat matrix and call back function that creat another array for each row 

const gameBoard = document.getElementById('game-board');
const gameStatus = document.getElementById('game-status');
const resetButton = document.getElementById('reset-button');
const player1 = document.getElementById('player-1');
const player2 = document.getElementById('player-2');
const currentPlayerDisplay = document.getElementById('current-player');


// Create the game board 
function createBoard() 
{
  gameBoard.innerHTML = '';// reset border to make sure matrix is clear to play
  for (let row = 0; row < ROWS; row++) 
  {
    for (let col = 0; col < COLS; col++) 
    {
      const cell = document.createElement('div');// create div for each cell 
      cell.classList.add('cell');// add cell for each div to handle CSS
      cell.dataset.row = row;//add data to each row and column 
      cell.dataset.col = col;
      cell.addEventListener('click', handleCellClick);// when click call function 
      gameBoard.appendChild(cell);//add new div cell to each cell empty.
    }
  }
}

// Handle cell click event
function handleCellClick(event)
{
  if (gameOver) return;  // If the game is over, ignore clicks.

  const col = parseInt(event.target.dataset.col);  // Get the column number from the clicked cell.
  const row = findEmptyRow(col);  // Find the lowest empty row in that column.

  if (row === -1) return;  // If no empty row is found, ignore the click.

  // Update the board array to store the current player's move.
  board[row][col] = currentPlayer;

  // Find the corresponding cell in the UI and add the current player's class (e.g., 'red' or 'yellow').
  const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
  cell.classList.add(currentPlayer);  // Adds a visual marker for the current player.

  // Check if the current move resulted in a win.
  if (checkWinner(row, col)) 
  {
    gameStatus.textContent = `${currentPlayerDisplay.textContent} wins!`;  // Update the UI to show the winner.
    gameOver = true;  // Set the gameOver flag to true, stopping further clicks.
    return;
  }

  // Switch to the other player (assuming two players, 'red' and 'yellow').
  currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';

  updatePlayerTurnDisplay();  // Update the visual display showing whose turn it is.
  gameStatus.textContent = `Player ${currentPlayer === 'red' ? 1 : 2}'s turn`;  // Update the game status display for the next player.
}


// Update the display of player turns
function updatePlayerTurnDisplay()
{
  player1.classList.toggle('active', currentPlayer === 'red');
  player2.classList.toggle('active', currentPlayer === 'yellow');
}

// Find the first empty row in the column
function findEmptyRow(col)
{
  for (let row = ROWS - 1; row >= 0; row--) {
    if (!board[row][col]) return row;
  }
  return -1;
}

// Check if there's a winner
function checkWinner(row, col)
{
  return (
    checkDirection(row, col, 1, 0) || // Horizontal check (left-right)
    checkDirection(row, col, 0, 1) || // Vertical check (up-down)
    checkDirection(row, col, 1, 1) || // Diagonal check (bottom-left to top-right /)
    checkDirection(row, col, 1, -1)   // Diagonal check (top-left to bottom-right \)
  );
}

// Check a specific direction for 4 in a row
function checkDirection(row, col, rowStep, colStep)
{
  let count = 1;  // Start with 1 since the current piece is already counted.
  // Check in the positive direction (e.g., right, down, diagonal-right)
  for (let step = 1; step < 4; step++)
  {
    const r = row + step * rowStep;
    const c = col + step * colStep;
    if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === currentPlayer)
    {
      count++;  // Increment count if the adjacent piece belongs to the current player.
    } else 
    {
      break;  // Stop if out of bounds or if the piece does not belong to the current player.
    }
  }

  // Check in the negative direction (e.g., left, up, diagonal-left)
  for (let step = 1; step < 4; step++)
  {
    const r = row - step * rowStep;
    const c = col - step * colStep;
    if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === currentPlayer)
    {
      count++;  // Increment count if the adjacent piece belongs to the current player.
    } else
    {
      break;  // Stop if out of bounds or if the piece does not belong to the current player.
    }
  }

  return count >= 4;  // Return true if there are 4 or more consecutive pieces.
}


// Reset the game
function resetGame()
{
  board.forEach(row => row.fill(null));
  currentPlayer = 'red';
  gameOver = false;
  gameStatus.textContent = "Player 1's turn";
  updatePlayerTurnDisplay();
  createBoard();
}

// Initialize the game
createBoard();
resetButton.addEventListener('click', resetGame);

// ... existing code ...

// Handle cell click event
function handleCellClick(event)
{
  if (gameOver) return;

  const col = parseInt(event.target.dataset.col);  // Get the column from the clicked cell
  const row = findEmptyRow(col);  // Find the lowest available row in the column

  if (row === -1) return;  // If no row is available (column is full), do nothing

  // Update the game board and UI
  board[row][col] = currentPlayer;
  const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
  cell.classList.add(currentPlayer);  // Add current player's class for visual representation

  // Check if the move results in a win
  if (checkWinner(row, col))
  {
    localStorage.setItem('winner', currentPlayer);  // Store the winner in localStorage
    redirectToResult();  // Redirect to result page
    return;
  }

  // Check for a draw (all cells filled with no winner)
  if (checkDraw())
  {
    localStorage.setItem('winner', 'draw');  // Store 'draw' in localStorage
    redirectToResult();  // Redirect to result page
    return;
  }

  // Switch to the other player
  currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
  updatePlayerTurnDisplay();  // Update the display to show the next player's turn
  gameStatus.textContent = `Player ${currentPlayer === 'red' ? 1 : 2}'s turn`;
}

// Check if the board is completely filled (draw condition)
function checkDraw()
{
  return board.every(row => row.every(cell => cell !== null));
}

// Redirect to result page with a slight delay
function redirectToResult()
{
  setTimeout(() => {
    window.location.href = 'result.html';  // Redirect to the result page
  });  // Delay the redirect by 1 second we can add a time for delay for example ,1000  
}  
  