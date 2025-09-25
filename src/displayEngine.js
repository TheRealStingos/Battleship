function displayGameBoard(board, title, container) {
    const boardContainer = document.createElement("div");
    boardContainer.classList.add("board-container");
    
    const titleElement = document.createElement("div");
    titleElement.classList.add("board-title");
    titleElement.textContent = title;
    boardContainer.appendChild(titleElement);

    const grid = document.createElement("div");
    grid.classList.add("grid");
    boardContainer.appendChild(grid);

    board.spaces.forEach(space => {
        const tile = document.createElement('div');
        tile.className = 'tile';  
        tile.textContent = space;
        grid.appendChild(tile);  
    });
    
    container.appendChild(boardContainer);
}

export { displayGameBoard }