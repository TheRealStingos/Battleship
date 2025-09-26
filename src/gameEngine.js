import { createComputerPlayer, createHumanPlayer } from "./players.js"
import { displayGameBoard } from "./displayEngine.js"

let gameState = {
    human: null,
    cpu: null,
    currentTurn: 'human',
    gameOver: false
};

function startGame() {
    const inputSection = document.getElementById("input");
    const playerNameInput = document.getElementsByName("playername")[0];
    const playerName = playerNameInput.value || "Player";
    
    gameState.human = createHumanPlayer(playerName);
    gameState.cpu = createComputerPlayer();
    gameState.currentTurn = 'human';
    gameState.gameOver = false;

    const display = document.getElementById("display");
    inputSection.classList.add("hidden");
    display.innerHTML = "";
    
    const gameboardsContainer = document.createElement("div");
    gameboardsContainer.classList.add("gameboards");
    display.appendChild(gameboardsContainer);

    displayGameBoard(gameState.human.gameBoard, `${playerName}'s Board`, gameboardsContainer);
    displayGameBoard(gameState.cpu.gameBoard, "Computer's Board", gameboardsContainer);

    setupGame();
}

function setupGame() {
    const oppTiles = document.querySelectorAll(".opp-tile");

    oppTiles.forEach((tile, index) => {
        tile.addEventListener('click', () => {
            if (gameState.currentTurn !== 'human' || gameState.gameOver) {
                return;
            }

            if (tile.style.pointerEvents === 'none') {
                return;
            }

            humanTurn(tile, index);
        });
    });
}

function humanTurn(tile, index) {
    const space = gameState.cpu.gameBoard.spaces[index];
    const isHit = gameState.cpu.gameBoard.receiveAttack([space]);
    
    if (isHit) {
        console.log(`Hit on ${space}!`);
        tile.style.backgroundColor = 'red';
    } else {
        console.log(`Miss on ${space}`);
        tile.style.backgroundColor = 'blue';
    }
    
    tile.style.pointerEvents = 'none';
    
    if (gameState.cpu.gameBoard.ships === gameState.cpu.gameBoard.sunk) {
        console.log(`${gameState.human.name} wins!`);
        gameState.gameOver = true;
        return;
    }

    gameState.currentTurn = 'computer';
    
    setTimeout(() => {
        computerTurn();
    }, 1000);
}

function computerTurn() {
    if (gameState.gameOver || gameState.currentTurn !== 'computer') {
        return;
    }

    const humanTiles = document.querySelectorAll(".tile");
    
    const availableTiles = Array.from(humanTiles).filter(tile => 
        tile.style.pointerEvents !== 'none'
    );
    
    if (availableTiles.length === 0) {
        console.log("No more tiles to attack!");
        gameState.gameOver = true;
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * availableTiles.length);
    const targetTile = availableTiles[randomIndex];
    
    const space = targetTile.textContent;
    
    const isHit = gameState.human.gameBoard.receiveAttack([space]);
    
    if (isHit) {
        console.log(`Computer hit your ${space}!`);
        targetTile.style.backgroundColor = 'red';
    } else {
        console.log(`Computer missed at ${space}`);
        targetTile.style.backgroundColor = 'lightblue';
    }
    
    targetTile.style.pointerEvents = 'none';
    
    if (gameState.human.gameBoard.ships === gameState.human.gameBoard.sunk) {
        console.log("Computer wins!");
        gameState.gameOver = true;
        return;
    }

    gameState.currentTurn = 'human';
}

export { startGame }