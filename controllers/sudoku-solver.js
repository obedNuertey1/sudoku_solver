import { puzzlesAndSolutions } from './puzzle-strings.js'


class SudokuSolver {
  
  validate(puzzleString) {
    if (puzzleString === "" || puzzleString === undefined) return {'valid': false, 'msg': 'Required field missing'}
    let validStr = this.valChars(puzzleString);
    let validLen = this.valLength(puzzleString);

    if (!validStr) return {'valid': false, 'msg': 'Invalid characters in puzzle'};
    if (!validLen) return  {'valid': false, 'msg': 'Expected puzzle to be 81 characters long'};
    

    // test for valid puzzle
    const rows = this.createRows(puzzleString);
    let cols = [];
    // On
    for (let i=1; i<=9; i++) {
      const col = this.createCols(rows, i);
      cols.push(col);
    }
    const grids = this.createGrids(puzzleString);

    for (let j=0; j<9; j++) {
      let row = rows[j];
      let col = cols[j];
      let grid = grids[j];

      let rowTest = row.filter(num => row.indexOf(num) !== row.lastIndexOf(num) && num !== '.');
      let colTest = col.filter(num => col.indexOf(num) !== col.lastIndexOf(num) && num !== '.');
      let gridTest = grid.filter(num => grid.indexOf(num) !== grid.lastIndexOf(num) && num !== '.');

      if (rowTest.length !== 0 || colTest.length !== 0 || gridTest.length !== 0) return {'valid': false, 'msg': 'Puzzle cannot be solved'}
    }
    return {'valid': true}
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let grid = this.createRows(puzzleString);
    let rows = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
    let strRow = grid[rows.indexOf(row.toLowerCase())];
    let rowVal = strRow[parseInt(column) - 1];
    
    if (rowVal === value) {
      strRow.splice(parseInt(column) - 1, 1)
    } else if (rowVal !== '.') {
      return false
    }
    
    strRow[parseInt(column) - 1] === value ? strRow.splice(parseInt(column) - 1, 1) : strRow;
    
    return strRow.indexOf(value.toString()) === -1;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let col = parseInt(column);
    let grid = this.createRows(puzzleString);
    let strCol = this.createCols(grid, col);
    // test whether val passed does not exist within column arr
    // make row key var to tell which col to splice
    let rowKey = {a:0,b:1,c:2,d:3,e:4,f:5,g:6,h:7,i:8};
    let colVal = strCol[rowKey[row]];
    
    if (colVal === value) {
      strCol.splice(rowKey[row], 1);
    } else if (colVal !== '.') {
      return false
    }
    
    return strCol.indexOf(value.toString()) === -1;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const grids = this.createGrids(puzzleString);
    let key = {'a': 1, 'b': 2, 'c': 3, 'd': 4,'e': 5,'f': 6, 'g': 7, 'h': 8, 'i': 9};
    let rowNum = key[row.toLowerCase()];
    let colNum = parseInt(column);
    let grid;

    if (rowNum <= 3) {
      if (colNum <= 3) {
        grid = grids[0];
      } else if (colNum <= 6) {
        grid = grids[1];
      } else if (colNum <= 9) {
        grid = grids[2];
      }
    } else if (rowNum <= 6) {
      if (colNum <= 3) {
        grid = grids[3];
      } else if (colNum <= 6) {
        grid = grids[4];
      } else if (colNum <= 9) {
        grid = grids[5];
      }
    } else if (rowNum <= 9) {
      if (colNum <= 3) {
        grid = grids[6];
      } else if (colNum <= 6) {
        grid = grids[7];
      } else if (colNum <= 9) {
        grid = grids[8];
      }
    }

    let row_calc = {a:0, b:1, c:2, d:0, e:1, f:2, g:0, h:1, i:2};
    let col_calc = (colNum - 1) % 3;
    let grid_calc = (row_calc[row.toLowerCase()] * 3) + col_calc;
    let grid_val = grid[grid_calc];
    
    if (grid_val === value) {
      grid.splice(parseInt(grid_calc), 1)
    } else if (grid_val !== '.') {
      return false
    }
    
    const gridTest = grid.indexOf(value.toString()) === -1;
  
    return gridTest
  }
    
  solve(puzzleString) {
    const validResults = this.validate(puzzleString);
    if (!validResults.valid) return validResults;
    
    let grids = this.createGrids(puzzleString);
    let gridsCopy = grids.slice();
    let nums = ['1','2','3','4','5','6','7','8','9'];
    // sort by arrs that have more nums than '.'
    let ordered = grids.sort((a,b) => b.filter(char => char != '.').length - a.filter(char => char != '.').length);
    // keep looping until puzzleString is full of nums
    while(![...puzzleString].every(curr => curr !== '.')) {
    // iterate over the ordered grids
    // (start at the ones that are already mostly filled out)
     for (const arr of ordered) {
      
      let indexKey = {0: 0, 1: 3, 2: 6, 3: 27, 4: 30, 5: 33, 6: 54, 7: 57, 8: 60};
      let strIndex = indexKey[gridsCopy.indexOf(arr)];
      
      arr.forEach((item, i) => {
        if (item !== '.') return
        // HOW TO CALC ROW START
        // (strIndex + (9 * (Math.floor(i / 3)))) + (i % 3) % 9
         let puzzle_index = (strIndex + (9 * (Math.floor(i / 3)))) + (i % 3);
         let puzzle_diff = puzzle_index % 9;  // == col number
         let puzzle_row_i = Array.from(puzzleString.substr(puzzle_index - puzzle_diff, 9));
        //    ^   this should be the proper row for item
        
        function setCharAt(str,index,chr) {
          if(index > str.length-1) return str;
          return str.substring(0,index) + chr + str.substring(index+1);
        }
        
        let colArr = [];
        for(let count=puzzle_diff; count<81; count+=9) {
          colArr.push(puzzleString[count]);
        }

        // GRID NUMS !-> NUMS
        let filteredKeywords = nums.filter(num => !arr.slice().includes(num));
        // FILTEREDNUMS !-> COL
        let colFilteredNums = filteredKeywords.filter((num) => !colArr.includes(num.toString()));
        // FILTEREDNUMS !-> ROW
        let rowFilteredNums = filteredKeywords.filter((num) => !puzzle_row_i.includes(num.toString()));
        // CORRELATE_NUMS == the nums that match with both row/col
        let correlate_nums = colFilteredNums.filter(num => rowFilteredNums.includes(num));

        // if the correlation is 1 item then add that item
        if (correlate_nums.length === 1) {
          // arr[i] = correlate_nums[0];
          puzzleString = setCharAt(puzzleString, puzzle_index, correlate_nums[0]);
        }
      });
     }
    }
    return puzzleString;
  }

  ///////////////////////////
  // logic for tests & app //
  ///////////////////////////

  // test str.length is 81 chars : boolean
  valLength(str) {
    return str.length === 81 ? true : false
  }

  // checks for valid chars within str : boolean
  valChars(str) {
    const regex = /[\d.]/;
    const strCheck = str.split('').every((item) => regex.test(item));
    return strCheck
  }

  // returns a multidimensional array : [[]]
  createRows(str) {
    let grid = [];
    let goodArr = str.split('');
    
    for (let i=9; i>0; i--) {
    	grid.push(goodArr.splice(0, 9));
    }
    // grid should be [1.5..2, ..63, etc]
    return grid
  }

  // returns an array with specified column number : []
  createCols(arr, colNum) {
    // arr == multi-dimensional array
    let cols = [];
    for (const item of arr) {
      cols.push(item[colNum - 1]);  
    }

    return cols;
  }

  // returns a multidimensional array of 3x3 grids : [[]]
  createGrids(puzzleString) {
    let grids = [];
    let subarrs = [];

    for(let i=0; i < 3; i++) { // O1 constant time
      subarrs.push(puzzleString.substr(i * 27, 27));
    }

    for (const arr of subarrs) {
      for (let i=0; i<=6; i+=3) { // O1 constant
        // (0,3) (9, 3) (18, 3)
        let grid = [];
        
        for (let j=i; j<27; j+=9) { // O1 constant
          grid.push(...arr.substr(j, 3).split(''));
          // grid.push(arr.substr(j*i, 3))
        }
        grids.push(grid);
      }
    }
    return grids
  }
  
}

// let game = new SudokuSolver();
// let gameResult = game.checkRegionPlacement(puzzlesAndSolutions[0][0], 'I', '3', '3');
// let solve = game.solve('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.');
// let solve = game.solve('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..');
// console.log(solve);

module.exports = SudokuSolver;

