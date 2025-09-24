const ship = require('/src/ships');

describe('ship', () => {
  test('creates a ship with correct initial properties', () => {
    const testShip = ship(3);
    
    expect(testShip.size).toBe(3);
    expect(testShip.hits).toBe(0);
    expect(testShip.coords).toEqual(new Array(testShip.size).fill(null));
  });

  test('creates ships with different sizes', () => {
    const smallShip = ship(1);
    const largeShip = ship(5);
    
    expect(smallShip.size).toBe(1);
    expect(largeShip.size).toBe(5);
  });

  describe('hit method', () => {
    test('increments hits when target coordinates match ship coordinates', () => {
      const testShip = ship(2);
      testShip.coords = 'A1';
      
      testShip.hit('A1');
      
      expect(testShip.hits).toBe(1);
    });

    test('does not increment hits when target coordinates do not match', () => {
      const testShip = ship(2);
      testShip.coords = 'A1';
      
      testShip.hit('B2');
      
      expect(testShip.hits).toBe(0);
    });

    test('can be hit multiple times at same coordinates', () => {
      const testShip = ship(3);
      testShip.coords = 'C3';
      
      testShip.hit('C3');
      testShip.hit('C3');
      testShip.hit('C3');
      
      expect(testShip.hits).toBe(3);
    });

    test('does nothing when ship has no coordinates set', () => {
      const testShip = ship(2);
      // coords remains null
      
      testShip.hit('A1');
      
      expect(testShip.hits).toBe(0);
    });
  });

  describe('isSunk method', () => {
    test('returns false when ship has not been hit', () => {
      const testShip = ship(3);
      
      expect(testShip.isSunk()).toBe(false);
    });

    test('returns false when hits are less than size', () => {
      const testShip = ship(3);
      testShip.coords = 'D4';
      
      testShip.hit('D4');
      testShip.hit('D4');
      
      expect(testShip.hits).toBe(2);
      expect(testShip.isSunk()).toBe(false);
    });

    test('returns true when hits equal size', () => {
      const testShip = ship(2);
      testShip.coords = 'E5';
      
      testShip.hit('E5');
      testShip.hit('E5');
      
      expect(testShip.hits).toBe(2);
      expect(testShip.isSunk()).toBe(true);
    });

    test('returns true for single-size ship after one hit', () => {
      const testShip = ship(1);
      testShip.coords = 'F6';
      
      testShip.hit('F6');
      
      expect(testShip.isSunk()).toBe(true);
    });
  });

  describe('ship object methods', () => {
    test('ship methods work together correctly', () => {
      const testShip = ship(3);
      testShip.coords = 'G7';
      
      // Ship starts unsunk
      expect(testShip.isSunk()).toBe(false);
      
      // Hit twice
      testShip.hit('G7');
      testShip.hit('G7');
      expect(testShip.isSunk()).toBe(false);
      
      // Final hit sinks the ship
      testShip.hit('G7');
      expect(testShip.isSunk()).toBe(true);
    });
  });
});