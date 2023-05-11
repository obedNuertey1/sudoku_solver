'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');
const sudokuSolver = new SudokuSolver();

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const validCols = ['a','b','c','d','e','f','g','h','i'];
      const validNums = [1,2,3,4,5,6,7,8,9];
      
      if (!req.body.hasOwnProperty('puzzle') || req.body.puzzle === '' || !req.body.hasOwnProperty('coordinate') || req.body.coordinate === '' || !req.body.hasOwnProperty('value') || req.body.value === '') {
        res.send({ error: "Required field(s) missing" });
        return
      }
      if (req.body.coordinate.length > 2 || 
          validNums.indexOf(parseInt(req.body.coordinate[1])) === -1 ||
          validCols.indexOf(req.body.coordinate[0].toLowerCase()) === -1) {
        res.send({ error: "Invalid coordinate" });
        return
      }
      if (validNums.indexOf(parseInt(req.body.value)) === -1 || parseInt(req.body.value) > 9 || parseInt(req.body.value) < 1) {
        res.send({ error: 'Invalid value' });
        return
      } 
      if (!solver.valChars(req.body.puzzle)) {
        res.send({ error: 'Invalid characters in puzzle' });
        return
      }
      if (!solver.valLength(req.body.puzzle)) {
        res.send({ error: 'Expected puzzle to be 81 characters long' });
        return
      }
      
      const puzzle = req.body.puzzle;
      let row = req.body.coordinate[0].toLowerCase();
      let col = req.body.coordinate[1];
      let val = req.body.value;

      //puzzleString, row, column, value
      let rowCheck = solver.checkRowPlacement(puzzle, row, col, val);
      let colCheck = solver.checkColPlacement(puzzle, row, col, val);
      let gridCheck = solver.checkRegionPlacement(puzzle, row, col, val);
      const responseResult = {row: rowCheck, column: colCheck, region: gridCheck};
      
      let valid = rowCheck && colCheck && gridCheck ? true : false;
      let response = {'valid': valid};
      
      if (!valid) response['conflict'] = [];
      
      for (const prop in responseResult) {
        if (!responseResult[prop]) response['conflict'].push(prop);
      }
      
      res.send(response);
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      let result = {};
      try {
        const solved = solver.solve(puzzle);
        if (typeof solved !== 'string') {
          result['error'] = solved.msg;
        } else {
          result['solution'] = solved;
        }
      }
      catch(err) {
        result['error'] = err;
      }
      res.send(result);
    });
  
  
};
