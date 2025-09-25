import { createComputerPlayer, createHumanPlayer } from "./players.js"
import { displayGameBoard } from "./displayEngine.js"

function startGame() {
    const inputSection = document.getElementById("input");
    const playerNameInput = document.getElementsByName("playername")[0];
    const playerName = playerNameInput.value || "Player";
    
    const human = createHumanPlayer(playerName);
    const cpu = createComputerPlayer();

    const display = document.getElementById("display");
    inputSection.classList.add("hidden");
    display.innerHTML = "";
    
    const gameboardsContainer = document.createElement("div");
    gameboardsContainer.classList.add("gameboards");
    display.appendChild(gameboardsContainer);

    displayGameBoard(human.gameBoard, `${playerName}'s Board`, gameboardsContainer);
    displayGameBoard(cpu.gameBoard, "Computer's Board", gameboardsContainer);
}

export { startGame }