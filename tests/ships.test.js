import ship from '../src/ships.js';

describe('ship', () => {
  test('creates a ship with correct initial properties', () => {
    const testShip = ship('Destroyer', 2);
    
    expect(testShip.name).toBe('Destroyer');
    expect(testShip.size).toBe(2);
    expect(testShip.hits).toBe(0);
    expect(testShip.coords).toEqual([null, null]);
  });

  test('creates ships with different sizes', () => {
    const smallShip = ship('Patrol', 1);
    const largeShip = ship('Carrier', 5);
    
    expect(smallShip.size).toBe(1);
    expect(largeShip.size).toBe(5);
    expect(smallShip.coords.length).toBe(1);
    expect(largeShip.coords.length).toBe(5);
  });

  describe('hit method', () => {
    test('increments hits when target coordinates match ship coordinates', () => {
      const testShip = ship('Cruiser', 3);
      testShip.coords = ['A1', 'A2', 'A3'];
      
      testShip.hit('A1');
      
      expect(testShip.hits).toBe(1);
    });

    test('does not increment hits when target coordinates do not match', () => {
      const testShip = ship('Destroyer', 2);
      testShip.coords = ['A1', 'A2'];
      
      testShip.hit('B2');
      
      expect(testShip.hits).toBe(0);
    });

    test('can register multiple hits on different coordinates', () => {
      const testShip = ship('Battleship', 4);
      testShip.coords = ['C1', 'C2', 'C3', 'C4'];
      
      testShip.hit('C1');
      testShip.hit('C2');
      testShip.hit('C3');
      
      expect(testShip.hits).toBe(3);
    });

    test('does nothing when ship has no coordinates set', () => {
      const testShip = ship('Submarine', 3);
      
      testShip.hit('A1');
      
      expect(testShip.hits).toBe(0);
    });

    test('handles hitting the same coordinate multiple times', () => {
      const testShip = ship('Destroyer', 2);
      testShip.coords = ['D4', 'D5'];
      
      testShip.hit('D4');
      testShip.hit('D4');
      
      expect(testShip.hits).toBe(2);
    });
  });

  describe('isSunk method', () => {
    test('returns false when ship has not been hit', () => {
      const testShip = ship('Cruiser', 3);
      testShip.coords = ['E1', 'E2', 'E3'];
      
      expect(testShip.isSunk()).toBe(false);
    });

    test('returns false when hits are less than size', () => {
      const testShip = ship('Carrier', 5);
      testShip.coords = ['A1', 'A2', 'A3', 'A4', 'A5'];
      
      testShip.hit('A1');
      testShip.hit('A2');
      testShip.hit('A3');
      
      expect(testShip.hits).toBe(3);
      expect(testShip.isSunk()).toBe(false);
    });

    test('returns true when hits equal size', () => {
      const testShip = ship('Destroyer', 2);
      testShip.coords = ['F5', 'F6'];
      
      testShip.hit('F5');
      testShip.hit('F6');
      
      expect(testShip.hits).toBe(2);
      expect(testShip.isSunk()).toBe(true);
    });

    test('returns true for single-size ship after one hit', () => {
      const testShip = ship('Patrol', 1);
      testShip.coords = ['G7'];
      
      testShip.hit('G7');
      
      expect(testShip.isSunk()).toBe(true);
    });
  });

  describe('ship lifecycle', () => {
    test('ship methods work together correctly', () => {
      const testShip = ship('Submarine', 3);
      testShip.coords = ['H1', 'H2', 'H3'];
      
      expect(testShip.isSunk()).toBe(false);
      
      testShip.hit('H1');
      testShip.hit('H2');
      expect(testShip.isSunk()).toBe(false);
      
      testShip.hit('H3');
      expect(testShip.isSunk()).toBe(true);
    });
  });
});