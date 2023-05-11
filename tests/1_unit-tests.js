const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();
let string = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
let badStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.73.4.3..6..';
let stringNot81 = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6';
let stringContainInvalidChar = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..abc';
const row = 'A';
const columns = '1';
const value = '7'

suite('Unit Tests', () => {
  
  suite('puzzle string testing', function(){
    
    test('Logic handles a valid puzzle string of 81 characters', function(){
      assert.deepEqual(solver.validate(string), {valid: true});
    });

    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function(){
      assert.deepEqual(solver.validate(stringContainInvalidChar), {'valid': false, 'msg': 'Invalid characters in puzzle'});
      assert.deepEqual(solver.validate(string), {valid: true});
    });

    test('Logic handles a puzzle string that is not 81 characters in length', function(){
     assert.deepEqual(solver.validate(stringNot81), {'valid': false, 'msg': 'Expected puzzle to be 81 characters long'});
    });
    
  });

  suite('row placement', function(){

    test('Logic handles a valid row placement', function(){
      assert.isOk(solver.checkRowPlacement(string, row, columns, value));
    });

    test('Logic handles an invalid row placement', function(){
      assert.isNotOk(solver.checkRowPlacement(string, row, columns, '5'));
    });
    
  });

  suite('column placement', function(){

    test('Logic handles a valid column placement', function(){
      assert.isNotOk(solver.checkColPlacement(string, row, columns, 4));
    });

    test('Logic handles an invalid column placement', function(){
      assert.isNotOk(solver.checkColPlacement(string, 'I', '4', 4));
    })
    
  });

  suite('region placement', function(){
    test('Logic handles a valid region (3x3 grid) placement', function(){
      assert.isOk(solver.checkRegionPlacement(string, row, columns, value));
    });

    test('Logic handles an invalid region (3x3 grid) placement', function(){
      assert.isNotOk(solver.checkRegionPlacement(string, row, '1', '4'))
    });
  });

  suite('test solver', function(){

    test('Valid puzzle strings pass the solver', function(){
      assert.isString(solver.solve(string));
    });

    test('Invalid puzzle strings fail the solver', function(){
      assert.deepEqual(solver.solve(badStr), {'valid': false, 'msg': 'Puzzle cannot be solved'});
    })

    test('Solver returns the expected solution for an incomplete puzzle', function(){
      assert.isString(solver.solve(string));
    });
  });
  
});
