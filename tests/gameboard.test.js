import gameBoard from '../src/gameboard.js';
import ship from '../src/ships.js';

describe('gameBoard', () => {
  test('gameboard has all 100 locations', () => {
    const testBoard = gameBoard();

    expect(testBoard.spaces).toHaveLength(100);
    expect(testBoard.spaces[0]).toBe('A1');
    expect(testBoard.spaces[99]).toBe('J10');
  });

  test('gameboard initializes with correct default values', () => {
    const testBoard = gameBoard();

    expect(testBoard.hits).toBe(0);
    expect(testBoard.ships).toBe(0);
    expect(testBoard.sunk).toBe(0);
    expect(testBoard.shipSpace).toEqual([]);
    expect(testBoard.missSpace).toEqual([]);
    expect(testBoard.shipsArray).toEqual([]);
  });

  describe('placeShip', () => {
    test('places a ship with valid coordinates', () => {
      const testBoard = gameBoard();
      const testShip = ship('Destroyer', 2);
      
      const result = testBoard.placeShip(testShip, ['A1', 'A2']);
      
      expect(result).toBe(true);
      expect(testShip.coords).toEqual(['A1', 'A2']);
      expect(testBoard.shipSpace).toEqual(['A1', 'A2']);
      expect(testBoard.ships).toBe(1);
      expect(testBoard.shipsArray).toContain(testShip);
    });

    test('rejects placement when coordinates length does not match ship size', () => {
      const testBoard = gameBoard();
      const testShip = ship('Cruiser', 3);
      
      const result = testBoard.placeShip(testShip, ['B1', 'B2']);
      
      expect(result).toBe(false);
      expect(testBoard.ships).toBe(0);
    });

    test('rejects overlapping ship placement', () => {
      const testBoard = gameBoard();
      const ship1 = ship('Destroyer', 2);
      const ship2 = ship('Cruiser', 3);
      
      testBoard.placeShip(ship1, ['C1', 'C2']);
      const result = testBoard.placeShip(ship2, ['C2', 'C3', 'C4']);
      
      expect(result).toBe(false);
      expect(testBoard.ships).toBe(1);
      expect(testBoard.shipsArray).toHaveLength(1);
    });

    test('allows placement of multiple non-overlapping ships', () => {
      const testBoard = gameBoard();
      const ship1 = ship('Destroyer', 2);
      const ship2 = ship('Submarine', 3);
      
      testBoard.placeShip(ship1, ['D1', 'D2']);
      testBoard.placeShip(ship2, ['E5', 'E6', 'E7']);
      
      expect(testBoard.ships).toBe(2);
      expect(testBoard.shipSpace).toEqual(['D1', 'D2', 'E5', 'E6', 'E7']);
    });

    test('tracks all ships in shipsArray', () => {
      const testBoard = gameBoard();
      const ship1 = ship('Carrier', 5);
      const ship2 = ship('Battleship', 4);
      
      testBoard.placeShip(ship1, ['A1', 'A2', 'A3', 'A4', 'A5']);
      testBoard.placeShip(ship2, ['B1', 'B2', 'B3', 'B4']);
      
      expect(testBoard.shipsArray).toHaveLength(2);
      expect(testBoard.shipsArray[0].name).toBe('Carrier');
      expect(testBoard.shipsArray[1].name).toBe('Battleship');
    });
  });

  describe('receiveAttack', () => {
    test('registers a hit on a ship', () => {
      const testBoard = gameBoard();
      const testShip = ship('Destroyer', 2);
      testBoard.placeShip(testShip, ['F1', 'F2']);
      
      const result = testBoard.receiveAttack(['F1']);
      
      expect(result).toBe(true);
      expect(testBoard.hits).toBe(1);
      expect(testShip.hits).toBe(1);
    });

    test('registers a miss', () => {
      const testBoard = gameBoard();
      const testShip = ship('Cruiser', 3);
      testBoard.placeShip(testShip, ['G1', 'G2', 'G3']);
      
      const result = testBoard.receiveAttack(['H5']);
      
      expect(result).toBe(false);
      expect(testBoard.hits).toBe(0);
      expect(testBoard.missSpace).toContain('H5');
    });

    test('handles string coordinate (not array)', () => {
      const testBoard = gameBoard();
      const testShip = ship('Destroyer', 2);
      testBoard.placeShip(testShip, ['I1', 'I2']);
      
      const result = testBoard.receiveAttack('I1');
      
      expect(result).toBe(true);
      expect(testBoard.hits).toBe(1);
    });

    test('increments sunk counter when ship is sunk', () => {
      const testBoard = gameBoard();
      const testShip = ship('Destroyer', 2);
      testBoard.placeShip(testShip, ['J1', 'J2']);
      
      testBoard.receiveAttack(['J1']);
      expect(testBoard.sunk).toBe(0);
      
      testBoard.receiveAttack(['J2']);
      expect(testBoard.sunk).toBe(1);
    });

    test('returns "Game Over" when all ships are sunk', () => {
      const testBoard = gameBoard();
      const ship1 = ship('Destroyer', 2);
      const ship2 = ship('Patrol', 1);
      
      testBoard.placeShip(ship1, ['A1', 'A2']);
      testBoard.placeShip(ship2, ['B1']);
      
      testBoard.receiveAttack(['A1']);
      testBoard.receiveAttack(['A2']);
      const result = testBoard.receiveAttack(['B1']);
      
      expect(result).toBe('Game Over');
      expect(testBoard.sunk).toBe(2);
    });

    test('tracks multiple hits across different ships', () => {
      const testBoard = gameBoard();
      const ship1 = ship('Cruiser', 3);
      const ship2 = ship('Destroyer', 2);
      
      testBoard.placeShip(ship1, ['C1', 'C2', 'C3']);
      testBoard.placeShip(ship2, ['D5', 'D6']);
      
      testBoard.receiveAttack(['C1']);
      testBoard.receiveAttack(['D5']);
      
      expect(testBoard.hits).toBe(2);
      expect(ship1.hits).toBe(1);
      expect(ship2.hits).toBe(1);
    });

    test('tracks multiple misses', () => {
      const testBoard = gameBoard();
      const testShip = ship('Submarine', 3);
      testBoard.placeShip(testShip, ['E1', 'E2', 'E3']);
      
      testBoard.receiveAttack(['A5']);
      testBoard.receiveAttack(['B7']);
      testBoard.receiveAttack(['C9']);
      
      expect(testBoard.missSpace).toEqual(['A5', 'B7', 'C9']);
      expect(testBoard.hits).toBe(0);
    });
  });
});
