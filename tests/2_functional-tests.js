const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

let myString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
let invalidCharStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..abc';
let incorrectLength = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..34';
let strCannotBeSolved = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1495....4.37.4.3..6..';

chai.use(chaiHttp);

suite('Functional Tests', () => {
  
  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function(done){
      chai.request(server)
      .keepOpen()
      .post('/api/solve')
      .set('content-type', 'application/json')
      .send({puzzle: myString}).end((err, res)=>{
        assert.equal(res.status, 200);
        assert.property(res.body, 'solution');
        done();
      });
  });

  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function(done){
    chai.request(server)
    .keepOpen()
    .post('/api/solve')
    .set('content-type', 'application/json')
    .send({puzzle: ''})
    .end((err, res)=>{
      assert.equal(res.status, 200);
      assert.equal(res.body.error, "Required field missing");
      done();
    });
  });

  test('Solve a puzzle with invalid characters: POST request to /api/solve', function(done){
    chai.request(server)
    .keepOpen()
    .post('/api/solve')
    .set('content-type', 'application/json')
    .send({puzzle: invalidCharStr})
    .end((err, res)=>{
      assert.equal(res.status, 200);
      assert.equal(res.body.error, "Invalid characters in puzzle");
      done();
    });
  });

  test('Solve a puzzle with incorrect length: POST request to /api/solve', function(done){
    chai.request(server)
    .keepOpen()
    .post('/api/solve')
    .set('content-type', 'application/json')
    .send({puzzle: incorrectLength})
    .end((err, res)=>{
      assert.equal(res.status, 200);
      assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
      assert.property(res.body, 'error');
      done();
    });
  });

  test('Solve a puzzle that cannot be solved: POST request to /api/solve', function(done){
    chai.request(server)
    .keepOpen()
    .post('/api/solve')
    .set('content-type', 'application/json')
    .send({puzzle: strCannotBeSolved}).end((err, res)=>{
      assert.equal(res.status, 200);
      assert.equal(res.body.error, 'Puzzle cannot be solved');
      assert.equal(res.type, 'application/json');
      assert.property(res.body, 'error');
      done();
    });
  });

  test('Check a puzzle placement with all fields: POST request to /api/check', function(done){
    chai.request(server)
    .keepOpen()
    .post('/api/check')
    .set('content-type', 'application/json')
    .send({puzzle: myString, coordinate: 'A1', value: '7'})
    .end((err, res)=>{
      assert.equal(res.status, 200);
      assert.equal(res.type, 'application/json');
      assert.isOk(res.body.valid);
      assert.property(res.body, 'valid');
      assert.deepEqual(res.body, {"valid": true});
      done();
    });
  });

  test("Check a puzzle placement with single placement conflict: POST request to /api/check", function(done){
    chai.request(server)
    .keepOpen()
    .post('/api/check')
    .set('content-type', 'application/json')
    .send({puzzle: myString, coordinate: 'A1', value: '2'})
    .end((err, res)=>{
      assert.equal(res.status, 200);
      assert.equal(res.type, 'application/json');
      assert.isNotOk(res.body.valid);
      assert.property(res.body, "conflict");
      assert.equal(res.body.conflict.length, 1);
      done();
    });
  });

  test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", function(done){
    chai.request(server)
    .keepOpen()
    .post('/api/check')
    .set('content-type', 'application/json')
    .send({puzzle: myString, coordinate: 'A1', value: '8'})
    .end((err, res)=>{
      assert.equal(res.status, 200);
      assert.equal(res.type, 'application/json');
      assert.isNotOk(res.body.valid);
      assert.property(res.body, 'conflict');
      assert.isAtMost(res.body.conflict.length, 2);
      done();
    });
  });

  test("Check a puzzle placement with all placement conflicts: POST request to /api/check", function(done){
    chai.request(server)
    .keepOpen()
    .post('/api/check')
    .set('content-type', 'application/json')
    .send({puzzle: myString, coordinate: "A1", value: "5"})
    .end((err, res)=>{
      assert.equal(res.status, 200);
      assert.equal(res.type, 'application/json');
      assert.isNotOk(res.body.valid);
      assert.property(res.body, 'conflict');
      assert.isAtLeast(res.body.conflict.length, 3);
      done();
    });
  });

  test('Check a puzzle placement with missing required fields: POST request to /api/check', function(done){
    chai.request(server)
    .keepOpen()
    .post('/api/check')
    .set('content-type', 'application/json')
    .send({puzzle: myString, coordinate: "", value: "5"})
    .end((err, res)=>{
      assert.equal(res.status, 200);
      assert.equal(res.type, 'application/json');
      assert.deepEqual(res.body, {"error": "Required field(s) missing"});
      done();
    });
  });

  test('Check a puzzle placement with invalid characters: POST request to /api/check', function(done){
    chai.request(server)
    .keepOpen()
    .post('/api/check')
    .set("content-type", "application/json")
    .send({puzzle: invalidCharStr, coordinate: "A1", value: "5"})
    .end((err, res)=>{
      assert.equal(res.status, 200);
      assert.equal(res.type, 'application/json');
      assert.deepEqual(res.body, {"error": "Invalid characters in puzzle"});
      done();
    });
  });
  
  test('Check a puzzle placement with incorrect length: POST request to /api/check', function(done){
    chai.request(server)
    .keepOpen()
    .post('/api/check')
    .set("content-type", "application/json")
    .send({puzzle: incorrectLength, coordinate: "A1", value: "5"})
    .end((err, res)=>{
      assert.equal(res.status, 200);
      assert.equal(res.type, 'application/json');
      assert.deepEqual(res.body, { "error": "Expected puzzle to be 81 characters long" });
      done();
    });
  });
  
  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function(done){
    chai.request(server)
    .keepOpen()
    .post('/api/check')
    .set("content-type", "application/json")
    .send({puzzle: myString, coordinate: "A", value: "5"})
    .end((err, res)=>{
      assert.equal(res.status, 200);
      assert.equal(res.type, 'application/json');
      assert.deepEqual(res.body, { "error": "Invalid coordinate" });
      done();
    });
  });
  
  test('Check a puzzle placement with invalid placement value: POST request to /api/check', function(done){
    chai.request(server)
    .keepOpen()
    .post('/api/check')
    .set("content-type", "application/json")
    .send({puzzle: incorrectLength, coordinate: "A1", value: "53"})
    .end((err, res)=>{
      assert.equal(res.status, 200);
      assert.equal(res.type, 'application/json');
      assert.deepEqual(res.body, { "error": "Invalid value" });
      done();
    });
  });
});

