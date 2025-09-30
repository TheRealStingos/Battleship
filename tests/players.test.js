import { createHumanPlayer, createComputerPlayer } from '../src/players.js';

describe('Player Creation', () => {
  describe('createHumanPlayer', () => {
    test('creates a human player with given name', () => {
      const player = createHumanPlayer('Alice');
      
      expect(player.name).toBe('Alice');
      expect(player.gameBoard).toBeDefined();
      expect(player.gameBoard.spaces).toHaveLength(100);
    });

    test('creates player with gameBoard instance', () => {
      const player = createHumanPlayer('Bob');
      
      expect(player.gameBoard.ships).toBe(0);
      expect(player.gameBoard.hits).toBe(0);
      expect(player.gameBoard.shipSpace).toEqual([]);
    });

    test('creates multiple independent players', () => {
      const player1 = createHumanPlayer('Charlie');
      const player2 = createHumanPlayer('Diana');
      
      expect(player1.name).toBe('Charlie');
      expect(player2.name).toBe('Diana');
      expect(player1.gameBoard).not.toBe(player2.gameBoard);
    });
  });

  describe('createComputerPlayer', () => {
    test('creates a computer player with default name', () => {
      const computer = createComputerPlayer();
      
      expect(computer.name).toBe('Computer');
      expect(computer.gameBoard).toBeDefined();
    });

    test('creates computer with independent gameBoard', () => {
      const computer1 = createComputerPlayer();
      const computer2 = createComputerPlayer();
      
      expect(computer1.gameBoard).not.toBe(computer2.gameBoard);
    });

    test('computer gameBoard has all default properties', () => {
      const computer = createComputerPlayer();
      
      expect(computer.gameBoard.spaces).toHaveLength(100);
      expect(computer.gameBoard.ships).toBe(0);
      expect(computer.gameBoard.sunk).toBe(0);
      expect(computer.gameBoard.shipsArray).toEqual([]);
    });
  });
});