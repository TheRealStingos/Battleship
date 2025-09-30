 # Battleship Game

A classic Battleship game built with vanilla JavaScript, featuring an interactive ship placement system and gameplay against a computer opponent.

## Features

- **Interactive Ship Placement**: Click and drag to place ships on your board
- **Flexible Placement Controls**: 
  - Click to place ships horizontally or vertically
  - Press 'R' to rotate ship orientation
  - Drag to position ships dynamically
  - Visual feedback for valid/invalid placements
- **Turn-Based Gameplay**: Alternate turns with the computer opponent
- **Visual Feedback**: Color-coded hits (red), misses (blue), and ship positions (green)
- **Win Detection**: Game automatically detects when all ships are sunk

## Game Rules

### Ships
The game includes 5 ships of varying sizes:
- **Carrier**: 5 spaces
- **Battleship**: 4 spaces
- **Cruiser**: 3 spaces
- **Submarine**: 3 spaces
- **Destroyer**: 2 spaces

### Objective
Sink all of your opponent's ships before they sink yours!

## How to Play

1. **Enter Your Name**: Input your name in the text field
2. **Start Game**: Click the "Start Game" button
3. **Place Your Ships**:
   - Click on the board to select starting position
   - Drag to adjust ship placement
   - Press 'R' to rotate between horizontal/vertical
   - Click "Confirm Placement" when satisfied
   - Click "Clear Selection" to reset current selection
4. **Battle Phase**:
   - Click on opponent's board to attack
   - Red tiles indicate hits
   - Blue tiles indicate misses
   - Take turns with the computer until all ships are sunk
5. **Victory**: First player to sink all opponent ships wins!

## Project Structure

```
src/
├── index.js           # Entry point
├── gameEngine.js      # Game logic and state management
├── gameboard.js       # Board model and attack handling
├── ships.js           # Ship factory function
├── players.js         # Player creation
├── displayEngine.js   # DOM manipulation and rendering
├── styles.css         # Styling
└── template.html      # HTML structure

tests/
├── ships.test.js      # Ship unit tests
├── gameboard.test.js  # Gameboard unit tests
├── gameEngine.test.js
├── displayEngine.test.js
└── players.test.js
```

## Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd battleship-game

# Install dependencies
npm install

# Run development server
npm start
```

## Testing

The project includes unit tests for core game logic:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch
```

## Technologies Used

- **JavaScript (ES6+)**: Core game logic
- **HTML5**: Structure
- **CSS3**: Styling and animations
- **Jest**: Testing framework

## Game Logic

### Ship Placement
- Ships cannot overlap
- Ships must fit within the 10x10 grid
- Validation ensures proper placement before confirmation

### Attack System
- Each coordinate can only be attacked once
- Hits are tracked per ship
- Ships sink when all coordinates are hit
- Game ends when all ships of one player are sunk

### Computer AI
- Random target selection from available spaces
- Continues attacking on successful hits
- Switches to player turn on miss

## Future Enhancements

Potential features for future development:
- Smart AI with hunt/target mode
- Improved styling
- Click and drag functionality for ship placement