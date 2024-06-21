const playerSymbols = ['X', 'O', '▲', '◆'];

// Selecting elements
const gameGrid = document.querySelector('.game .grid');
const result = document.querySelector(".result");
const gameOver = document.querySelector(".game-over");
const resetBtn = document.querySelector(".reset");
const instructor = document.querySelector(".instructor");
const scoresContainer = document.querySelector(".scores");
const playerBtns = document.querySelectorAll(".player-btn");
const gridSizeBtns = document.querySelectorAll(".grid-size-btn");

// Initializing variables
let currentPlayerIndex = 0;
let count = 0;
let scores = [0, 0, 0, 0]; // Initialize scores for each player
let numPlayers = 2;
let gridSize = 3; // Initialize grid size

// Event listeners
resetBtn.addEventListener("click", reset);
playerBtns.forEach(btn => btn.addEventListener("click", startGame));
gridSizeBtns.forEach(btn => btn.addEventListener("click", setGridSize));

// Start the game with the selected number of players
function startGame(event) {
    numPlayers = parseInt(event.target.getAttribute("data-players"));
    currentPlayerIndex = 0;
    count = 0;
    resetGame();
    playerBtns.forEach(btn => btn.classList.remove("active"));
    event.target.classList.add("active");
    // Update scores when starting the game
    updateScores();
}

// Set the grid size and restart the game
function setGridSize(event) {
    gridSize = parseInt(event.target.getAttribute("data-grid-size"));
    resetGame();
    // Update active state of grid size buttons
    gridSizeBtns.forEach(btn => btn.classList.remove("active"));
    event.target.classList.add("active");
    // Update scores when setting grid size
    updateScores();
}

// Reset the game with the current settings
function resetGame() {
    let gridClass = 'grid-' + gridSize;
    gameGrid.className = 'grid ' + gridClass;
    gameGrid.innerHTML = ''; // Clear existing cells
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        gameGrid.appendChild(cell);
    }
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        cell.addEventListener("click", executeGame, { once: true });
    });
    updateInstructor();
    gameOver.style.display = 'none';
}

// Execute a move in the game
function executeGame(event) {
    event.target.innerText = playerSymbols[currentPlayerIndex];
    count++;
    if (checkWinner()) {
        scores[currentPlayerIndex]++;
        updateScores();
        result.innerText = 'Player' +playerSymbols[currentPlayerIndex]+' wins!';
        gameOver.style.display = 'flex';
    } else if (count === gridSize * gridSize) {
        result.innerText = "It's a draw!";
        gameOver.style.display = 'flex';
    } else {
        currentPlayerIndex = (currentPlayerIndex + 1) % numPlayers;
        updateInstructor();
    }
}

// Update the instructor message
function updateInstructor() {
    instructor.innerText = ' Player ' +playerSymbols[currentPlayerIndex]+ ' turn ';
}

// Update the scores on the screen
function updateScores() {
    scoresContainer.innerHTML = ''; // Clear existing scores
    for (let i = 0; i < numPlayers; i++) {
        const playerScore = document.createElement('p');
        playerScore.textContent = ' Player ' +playerSymbols[i] +' Score: ' +scores[i];
        scoresContainer.appendChild(playerScore);
    }
}

// Check for a winning condition
function checkWinner() {
    const cells = document.querySelectorAll(".cell");
    // Check rows
    for (let i = 0; i < gridSize; i++) {
        let row = [];
        for (let j = 0; j < gridSize; j++) {
            row.push(cells[i * gridSize + j].innerText);
        }
        if (row.every(symbol => symbol === playerSymbols[currentPlayerIndex])) {
            return true;
        }
    }

    // Check columns
    for (let i = 0; i < gridSize; i++) {
        let col = [];
        for (let j = 0; j < gridSize; j++) {
            col.push(cells[j * gridSize + i].innerText);
        }
        if (col.every(symbol => symbol === playerSymbols[currentPlayerIndex])) {
            return true;
        }
    }

    // Check main diagonal
    let mainDiagonal = [];
    for (let i = 0; i < cells.length; i += gridSize + 1) {
        mainDiagonal.push(cells[i].innerText);
    }
    if (mainDiagonal.every(symbol => symbol === playerSymbols[currentPlayerIndex])) {
        return true;
    }

    // Check anti-diagonal
    let antiDiagonal = [];
    for (let i = gridSize - 1; i < cells.length - 1; i += gridSize - 1) {
        antiDiagonal.push(cells[i].innerText);
    }
    if (antiDiagonal.every(symbol => symbol === playerSymbols[currentPlayerIndex])) {
        return true;
    }

    return false;
}

// Reset the entire game
function reset() {
    currentPlayerIndex = 0;
    count = 0;
    resetGame();
}

// Initialize the game with 2 players and default grid size
startGame({ target: document.querySelector('.player-btn[data-players="2"]') });
gridSizeBtns.forEach(btn => btn.classList.remove("active"));
document.querySelector('.grid-size-btn[data-grid-size="3"]').classList.add("active");