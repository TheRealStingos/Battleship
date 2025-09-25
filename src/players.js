import gameBoard from "./gameboard.js"

function createHumanPlayer(name) {
    return {
        name: name,
        gameBoard: gameBoard()
    }
}

function createComputerPlayer() {
    return {
        name: "Computer",
        gameBoard: gameBoard()
    }
}

export { createComputerPlayer, createHumanPlayer }