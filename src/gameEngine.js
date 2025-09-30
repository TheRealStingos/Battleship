import { createComputerPlayer, createHumanPlayer } from "./players.js"
import { displayGameBoard, displayPlayerSelect } from "./displayEngine.js"
import ship from "./ships.js"

const status = document.getElementById("status");
const display = document.getElementById("display");
const inputSection = document.getElementById("input");

let gameState = {
    human: null,
    cpu: null,
    currentTurn: 'human',
    gameOver: false,
    placementPhase: true,
    currentShipIndex: 0,
    shipsToPlace: [],
    selectedCells: [],
    orientation: 'horizontal',
    isDragging: false,
    dragStartCell: null
};

const SHIPS = [
    { name: 'Carrier', size: 5 },
    { name: 'Battleship', size: 4 },
    { name: 'Cruiser', size: 3 },
    { name: 'Submarine', size: 3 },
    { name: 'Destroyer', size: 2 }
];

function startGame() {
    const playerNameInput = document.getElementsByName("playername")[0];
    const playerName = playerNameInput.value || "Player";
    
    gameState.human = createHumanPlayer(playerName);
    gameState.cpu = createComputerPlayer();
    gameState.currentTurn = 'human';
    gameState.gameOver = false;
    gameState.placementPhase = true;
    gameState.currentShipIndex = 0;
    gameState.shipsToPlace = SHIPS.map(s => ship(s.name, s.size));
    gameState.selectedCells = [];
    gameState.orientation = 'horizontal';
    gameState.isDragging = false;
    gameState.dragStartCell = null;

    inputSection.classList.add("hidden");
    status.innerHTML = "";
    status.classList.remove("hidden");
    display.innerHTML = "";
    
    placeComputerShips();
    
    startPlacementPhase();
}

function placeComputerShips() {
    SHIPS.forEach(shipData => {
        const cpuShip = ship(shipData.name, shipData.size);
        let placed = false;
        
        while (!placed) {
            const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
            const coords = generateRandomCoords(shipData.size, orientation);
            placed = gameState.cpu.gameBoard.placeShip(cpuShip, coords);
        }
    });
}

function generateRandomCoords(size, orientation) {
    const letters = 'ABCDEFGHIJ';
    const coords = [];
    
    if (orientation === 'horizontal') {
        const row = letters[Math.floor(Math.random() * 10)];
        const startCol = Math.floor(Math.random() * (11 - size)) + 1;
        
        for (let i = 0; i < size; i++) {
            coords.push(`${row}${startCol + i}`);
        }
    } else {
        const startRow = Math.floor(Math.random() * (11 - size));
        const col = Math.floor(Math.random() * 10) + 1;
        
        for (let i = 0; i < size; i++) {
            coords.push(`${letters[startRow + i]}${col}`);
        }
    }
    
    return coords;
}

function startPlacementPhase() {
    const container = document.createElement("div");
    container.classList.add("placement-container");
    
    const instructions = document.createElement("div");
    instructions.id = "placement-instructions";
    instructions.innerHTML = `
        <h2>Place Your Ships</h2>
        <p>Placing: ${gameState.shipsToPlace[0].name} (${gameState.shipsToPlace[0].size} spaces)</p>
        <p>Click to place ships. Press 'R' to rotate.</p>
        <button id="confirm-placement">Confirm Placement</button>
        <button id="clear-selection">Clear Selection</button>
    `;
    container.appendChild(instructions);
    
    const boardContainer = document.createElement("div");
    boardContainer.classList.add("board-container");
    
    displayGameBoard(gameState.human.gameBoard, "Your Board", boardContainer);
    container.appendChild(boardContainer);
    
    display.appendChild(container);
    
    setupPlacementListeners();
}

function setupPlacementListeners() {
    const tiles = document.querySelectorAll(".tile");
    
    tiles.forEach((tile, index) => {
        tile.addEventListener('mousedown', (e) => handleMouseDown(tile, index, e));
        tile.addEventListener('mouseenter', () => handleMouseEnter(tile, index));
        tile.addEventListener('mouseleave', () => handleMouseLeave());
        tile.addEventListener('mouseup', () => handleMouseUp());
    });
    
    document.addEventListener('mouseup', handleMouseUp);
    
    document.getElementById("confirm-placement").addEventListener('click', confirmPlacement);
    document.getElementById("clear-selection").addEventListener('click', clearSelection);
    
    document.addEventListener('keydown', handleRotation);
}

function handleMouseDown(tile, index, e) {
    e.preventDefault();
    gameState.isDragging = true;
    gameState.dragStartCell = gameState.human.gameBoard.spaces[index];
    
    clearSelection();
    
    const currentShip = gameState.shipsToPlace[gameState.currentShipIndex];
    const coords = generateCoordsFromClick(gameState.dragStartCell, currentShip.size, gameState.orientation);
    
    if (coords && isValidPlacement(coords)) {
        gameState.selectedCells = coords;
        highlightCells(coords, 'valid');
    } else {
        highlightCells(coords || [gameState.dragStartCell], 'invalid');
    }
}

function handleMouseEnter(tile, index) {
    const currentCell = gameState.human.gameBoard.spaces[index];
    const currentShip = gameState.shipsToPlace[gameState.currentShipIndex];
    
    if (gameState.isDragging) {
        clearSelection();
        
        const coords = calculateDragCoords(gameState.dragStartCell, currentCell, currentShip.size);
        
        if (coords && coords.length === currentShip.size && isValidPlacement(coords)) {
            gameState.selectedCells = coords;
            highlightCells(coords, 'valid');
        } else if (coords) {
            highlightCells(coords, 'invalid');
        }
    } else {
        clearPreview();
        
        const coords = generateCoordsFromClick(currentCell, currentShip.size, gameState.orientation);
        
        if (coords && isValidPlacement(coords)) {
            highlightCells(coords, 'preview');
        }
    }
}

function handleMouseLeave() {
    if (!gameState.isDragging) {
        clearPreview();
    }
}

function handleMouseUp() {
    gameState.isDragging = false;
    gameState.dragStartCell = null;
}

function calculateDragCoords(startCell, endCell, shipSize) {
    const letters = 'ABCDEFGHIJ';
    const startLetter = startCell[0];
    const startNum = parseInt(startCell.substring(1));
    const endLetter = endCell[0];
    const endNum = parseInt(endCell.substring(1));
    
    const startRow = letters.indexOf(startLetter);
    const endRow = letters.indexOf(endLetter);
    
    const coords = [];
    
    const rowDiff = Math.abs(endRow - startRow);
    const colDiff = Math.abs(endNum - startNum);
    
    if (colDiff >= rowDiff) {
        const minCol = Math.min(startNum, endNum);
        const maxCol = Math.max(startNum, endNum);
        const length = Math.min(maxCol - minCol + 1, shipSize);
        
        let actualStart = startNum <= endNum ? minCol : Math.max(minCol, maxCol - shipSize + 1);
        actualStart = Math.max(1, Math.min(actualStart, 11 - shipSize));
        
        for (let i = 0; i < shipSize; i++) {
            coords.push(`${startLetter}${actualStart + i}`);
        }
    } else {
        const minRow = Math.min(startRow, endRow);
        const maxRow = Math.max(startRow, endRow);
        const length = Math.min(maxRow - minRow + 1, shipSize);
        
        let actualStart = startRow <= endRow ? minRow : Math.max(minRow, maxRow - shipSize + 1);
        actualStart = Math.max(0, Math.min(actualStart, 10 - shipSize));
        
        for (let i = 0; i < shipSize; i++) {
            coords.push(`${letters[actualStart + i]}${startNum}`);
        }
    }
    
    return coords;
}

function generateCoordsFromClick(startSpace, size, orientation) {
    const letter = startSpace[0];
    const num = parseInt(startSpace.substring(1));
    const letters = 'ABCDEFGHIJ';
    const coords = [];
    
    if (orientation === 'horizontal') {
        if (num + size - 1 > 10) return null;
        
        for (let i = 0; i < size; i++) {
            coords.push(`${letter}${num + i}`);
        }
    } else {
        const startIndex = letters.indexOf(letter);
        if (startIndex + size > 10) return null;
        
        for (let i = 0; i < size; i++) {
            coords.push(`${letters[startIndex + i]}${num}`);
        }
    }
    
    return coords;
}

function isValidPlacement(coords) {
    return !coords.some(coord => gameState.human.gameBoard.shipSpace.includes(coord));
}

function highlightCells(coords, type) {
    const tiles = document.querySelectorAll(".tile");
    
    coords.forEach(coord => {
        const index = gameState.human.gameBoard.spaces.indexOf(coord);
        if (index !== -1) {
            if (type === 'valid') {
                tiles[index].classList.add('selected-valid');
            } else if (type === 'invalid') {
                tiles[index].classList.add('selected-invalid');
            } else if (type === 'preview') {
                tiles[index].classList.add('preview-valid');
            }
        }
    });
}

function clearSelection() {
    const tiles = document.querySelectorAll(".tile");
    tiles.forEach(tile => {
        tile.classList.remove('selected-valid', 'selected-invalid', 'preview-valid');
    });
    if (!gameState.isDragging) {
        gameState.selectedCells = [];
    }
}

function clearPreview() {
    const tiles = document.querySelectorAll(".tile");
    tiles.forEach(tile => {
        tile.classList.remove('preview-valid');
    });
}

function handleRotation(e) {
    if (e.key === 'r' || e.key === 'R') {
        gameState.orientation = gameState.orientation === 'horizontal' ? 'vertical' : 'horizontal';
        clearSelection();
        clearPreview();
    }
}

function confirmPlacement() {
    if (gameState.selectedCells.length === 0) {
        alert('Please select cells for your ship!');
        return;
    }
    
    const currentShip = gameState.shipsToPlace[gameState.currentShipIndex];
    
    if (gameState.selectedCells.length !== currentShip.size) {
        alert(`Ship must be exactly ${currentShip.size} spaces!`);
        return;
    }
    
    const placed = gameState.human.gameBoard.placeShip(currentShip, gameState.selectedCells);
    
    if (placed) {
        const tiles = document.querySelectorAll(".tile");
        gameState.selectedCells.forEach(coord => {
            const index = gameState.human.gameBoard.spaces.indexOf(coord);
            if (index !== -1) {
                tiles[index].style.backgroundColor = '#4CAF50';
                tiles[index].classList.remove('selected-valid');
            }
        });
        
        gameState.currentShipIndex++;
        gameState.selectedCells = [];
        
        if (gameState.currentShipIndex < gameState.shipsToPlace.length) {
            const instructions = document.getElementById("placement-instructions");
            const nextShip = gameState.shipsToPlace[gameState.currentShipIndex];
            instructions.querySelector('p').textContent = `Placing: ${nextShip.name} (${nextShip.size} spaces)`;
        } else {
            endPlacementPhase();
        }
    } else {
        alert('Invalid placement! Ships cannot overlap.');
    }
}

function endPlacementPhase() {
    gameState.placementPhase = false;
    document.removeEventListener('keydown', handleRotation);
    document.removeEventListener('mouseup', handleMouseUp);
    
    display.innerHTML = "";
    
    const gameboardsContainer = document.createElement("div");
    gameboardsContainer.classList.add("gameboards");
    display.appendChild(gameboardsContainer);

    displayGameBoard(gameState.human.gameBoard, `${gameState.human.name}'s Board`, gameboardsContainer);
    displayGameBoard(gameState.cpu.gameBoard, "Computer's Board", gameboardsContainer);

    // Color the player's ships
    const humanTiles = document.querySelectorAll(".tile");
    gameState.human.gameBoard.shipSpace.forEach(coord => {
        const index = gameState.human.gameBoard.spaces.indexOf(coord);
        if (index !== -1) {
            humanTiles[index].style.backgroundColor = '#4CAF50';
        }
    });

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
        const hitShip = gameState.cpu.gameBoard.shipsArray.find(ship => 
            ship.coords.includes(space) && ship.isSunk()
        );
        
        if (hitShip) {
            status.innerHTML = (`Hit on ${space}! You sunk the ${hitShip.name}!`);
        } else {
            status.innerHTML = (`Hit on ${space}!`);
        }
        
        tile.style.backgroundColor = 'red';

        
        if (gameState.cpu.gameBoard.ships === gameState.cpu.gameBoard.sunk) {
            status.innerHTML = (`${gameState.human.name} wins!`);
            gameState.gameOver = true;
            endGame(`${gameState.human.name}`);
            return;
        }
                
        tile.style.pointerEvents = 'none';
        return; 
        
    } else {
        status.innerHTML = (`Miss on ${space}`);
        tile.style.backgroundColor = 'blue';
        tile.style.pointerEvents = 'none';
        
        gameState.currentTurn = 'computer';
        
        setTimeout(() => {
            computerTurn();
        }, 1000);
    }
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
        endGame("Computer")
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * availableTiles.length);
    const targetTile = availableTiles[randomIndex];
    
    const space = targetTile.textContent;
    
    const isHit = gameState.human.gameBoard.receiveAttack([space]);
    
    if (isHit) {
        status.innerHTML = (`Computer hit your ${space}!`);
        targetTile.style.backgroundColor = 'red';
        targetTile.style.pointerEvents = 'none';
        
        if (gameState.human.gameBoard.ships === gameState.human.gameBoard.sunk) {
            status.innerHTML = ("Computer wins!");
            gameState.gameOver = true;
            return;
        }
        
        setTimeout(() => {
            computerTurn();
        }, 1000);
        
    } else {
        status.innerHTML = (`Computer missed at ${space}`);
        targetTile.style.backgroundColor = 'lightblue';
        targetTile.style.pointerEvents = 'none';
        
        gameState.currentTurn = 'human';
    }
}

function endGame(winner) {
    status.classList.add("hidden");
    display.innerHTML = `${winner} wins!`
    const restart = document.createElement("button")

    restart.innerText = "restart?"
    display.appendChild(restart)

    restart.addEventListener("click", () =>{
        displayPlayerSelect();
    })
}

export { startGame }