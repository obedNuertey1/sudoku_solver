# Sudoku Solver - Documentation
### Overview:
  - [Description And Usage](#description-and-usage)
  - [Technical Documentation](#technical-documentation)
  - [Visit Site](https://obn-sudoku-solver.onrender.com/)

## Description And Usage
This is a sudoku solver project in which the user enters a sequence of numbers between 1 and 9 separated by a series of dots. 
When solve is clicked a function makes sure the arraongement conforms to sudoku rules and the boxes in the sudoku pazzle is filled in a way that aligns with sudoku rules.
Also the user can make special inserts by typing in the coordinate and the value.

![image](https://github.com/obedNuertey1/sudoku_solver/assets/101027384/be7635f0-a0ae-4631-b306-0b4eee048664)

## Technical Documentation
* Solve a puzzle with valid puzzle string: POST request to /api/solve
* Solve a puzzle with missing puzzle string: POST request to /api/solve
* Solve a puzzle with invalid characters: POST request to /api/solve
* Solve a puzzle with incorrect length: POST request to /api/solve
* Solve a puzzle that cannot be solved: POST request to /api/solve
* Check a puzzle placement with all fields: POST request to /api/check
* Check a puzzle placement with single placement conflict: POST request to /api/check
* Check a puzzle placement with multiple placement conflicts: POST request to /api/check
* Check a puzzle placement with all placement conflicts: POST request to /api/check
* Check a puzzle placement with missing required fields: POST request to /api/check
* Check a puzzle placement with invalid characters: POST request to /api/check
* Check a puzzle placement with incorrect length: POST request to /api/check
* Check a puzzle placement with invalid placement coordinate: POST request to /api/check
* Check a puzzle placement with invalid placement value: POST request to /api/check
