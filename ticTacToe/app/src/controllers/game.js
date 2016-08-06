'use strict'

var gameApp = angular.module('gameApp', []);

gameApp.controller('GameCtrl', function($scope) {
  $scope.gamePrompt = "Please Click Start Game";
  $scope.boardLock = true;
  $scope.moveCounter = 0;
  $scope.playerType = 0;
  $scope.boardState = {
    a1: 0, a2: 0, a3: 0,
    b1: 0, b2: 0, b3: 0,
    c1: 0, c2: 0, c3: 0,
  };
  $scope.takenPositions = [];
  $scope.freePositions = Object.keys($scope.boardState);

  $scope.startPlayer = function() {
    $scope.gamePrompt = "Make your first move";
    $scope.boardLock = false;
  };

  $scope.startCPU = function() {
    $scope.boardLock = false;
    $scope.cpuMove();
    $scope.gamePrompt = "CPU Moved, make your move";
  };

  $scope.playerMove = function(position) {
    $scope.playerType = 1;
    if ($scope.placeMove(position) === false) {
      alert("Not a valid move, select another move");
    }
    else if (!$scope.checkVictory()) {
      $scope.cpuMove();
    }
    else {
      console.log("Waiting for an additional move");
    }
  };

  $scope.cpuDecision = function() {
    var randIndex = Math.floor(Math.random() * $scope.freePositions.length);
    return $scope.freePositions[randIndex];
  };

  $scope.cpuMove = function() {
    $scope.playerType = 2;
    var cpuChoice = $scope.cpuDecision();
    $scope.placeMove(cpuChoice);
    $scope.checkVictory();
  };

  $scope.markBoard = function(position) {
    var target = document.getElementById(position);
    if ($scope.boardState[position] == 1) {
      target.style.backgroundImage = "url('https://pbs.twimg.com/profile_images/551774827/X-no-background-400.png')";
    }
    else if ($scope.boardState[position] == 2) {
      target.style.backgroundImage = "url('http://www.idf.org/sites/default/files/Blue-circle-200px.jpg')";
    }
    else {
      alert("Error in Marking the Board");
    }
  };

  $scope.placeMove = function(position) {
    if ($scope.isvalidMove(position)) {
      $scope.boardState[position] = $scope.playerType;
      var index = $scope.freePositions.indexOf(position);
      if (index > -1) {
        $scope.freePositions.splice(index, 1);
      }
      $scope.takenPositions.push(position);
      $scope.moveCounter = $scope.moveCounter + 1;
      $scope.markBoard(position); 
      return true;   
    }
    else {
      alert("Not a valid move try again");
      return false;
    }
  };

  $scope.isvalidMove = function(position) {
    if ($scope.boardState[position] === 0) {
      return true;
    }
    else {
      return false;
    }
  };

  $scope.checkVictory = function() {
    var rows = ['a', 'b', 'c'];
    for (var i = 0; i < 3; i++) {
      var row = rows[i];
      if ($scope.isWinPattern($scope.boardState[row + '1'], $scope.boardState[row + '2'], $scope.boardState[row + '3'])
        && ($scope.isXorO($scope.boardState[row + '1'], 1, 2))) {
        $scope.endGame($scope.boardState[row + '1']);
        return true;
      }
    }

    var cols = ['1', '2', '3'];
    for (var i = 0; i < 3; i++) {
      var col = cols[i];
      if ($scope.isWinPattern($scope.boardState['a' + col], $scope.boardState['b' + col], $scope.boardState['c' + col])
        && ($scope.isXorO($scope.boardState['a' + col], 1, 2))) {
        $scope.endGame($scope.boardState['a' + col]);
        return true;
      }
    }

    if ($scope.isWinPattern($scope.boardState.a1, $scope.boardState.b2, $scope.boardState.c3) && ($scope.isXorO($scope.boardState.a1, 1, 2)))  {
      $scope.endGame($scope.boardState.a1);
      return true;
    }
    else if ($scope.isWinPattern($scope.boardState.a3, $scope.boardState.b2, $scope.boardState.c1) && ($scope.isXorO($scope.boardState.a3, 1, 2)))  {
      $scope.endGame($scope.boardState.a3);
      return true;
    }

    else if ($scope.moveCounter >= 9) {
      alert("Game is Over - No Victor");
      $scope.endGame(null);
      return true;
    }

    else {
      return false;
    }
  };

  $scope.isWinPattern = function(positionOne, positionTwo, positionThree) {
    if ((positionOne === positionTwo) && (positionOne === positionThree)) {
      if ($scope.boardState[positionOne] === 0) {
        return false;
      }
      return true;
    }
    return false;
  };

  $scope.isXorO = function(tileValue, xPieceValue, yPieceValue) {
    if (tileValue === xPieceValue || tileValue === yPieceValue) {
      return true;
    }
    return false;
  };

  $scope.endGame = function(winType) {
    if (winType === 1) {
      alert('X wins!');
      $scope.resetBoard();
    }
    else if (winType === 2) {
      alert("O wins!");
      $scope.resetBoard();
    }
    else if (winType === null) {
      alert("Game was a Stalemate");
      $scope.resetBoard();
    }
    else {
      alert("Game was ended Improperly");
      $scope.resetBoard();
    }
  };

  $scope.resetBoard = function() {
    $scope.boardLock = true;
    $scope.gamePrompt = "New Game Please Click Start Game";
    $scope.moveCounter = 0; 
    $scope.takenPositions = [];
    $scope.freePositions = ['a1', 'a2', 'a3', 'b1', 'b2',
    'b3', 'c1', 'c2', 'c3'];
    $scope.boardState = {
      a1: 0, a2: 0, a3: 0,
      b1: 0, b2: 0, b3: 0,
      c1: 0, c2: 0, c3: 0,
    }
    var keys = Object.keys($scope.boardState)
    for (var i = 0; i < keys.length; i++) {
      var target = document.getElementById(keys[i]);
        target.style.backgroundImage = null;
    }
  };

});