'use strict'

var gameApp = angular.module('gameApp', []);

gameApp.controller('GameCtrl', function($scope) {
  $scope.masterSequence = [];
  $scope.inputSequence = [];
  $scope.strictMode = false;
  $scope.buttonLock = true;
  $scope.stepCount = 0;
  $scope.gameMessage = "Welcome! Press Start!";

  $scope.strictToggle = function() {
    $scope.strictMode = !$scope.strictMode;
  };

  $scope.activate = function(buttonType) {
    var targetButton = document.getElementById("simonButton" + buttonType);
    var tempColor = targetButton.style.color;
    $scope.beep(buttonType);
    targetButton.style.background = "white";
    setTimeout(function() {
      targetButton.style.background = tempColor;
    }, 500)
  };

  $scope.playerActivate = function(buttonType) {
    if (!$scope.buttonLock) {
      $scope.activate(buttonType);
      if (buttonType === $scope.masterSequence[$scope.stepCount]) {
        $scope.gameMessage = "Great Job!";
        $scope.stepCount++;
      }
      else {
        $scope.gameMessage = "Wrong Button giving you a hint!";
        if (!$scope.strictMode) {
          $scope.gameMessage = "Error, giving hint";
          $scope.hint();
        }
        else if ($scope.strictMode) {
          $scope.gameMessage = "Error in Strict Mode! Restart from Scratch!";
          $scope.resetGame();
          $scope.startGame();
        }
        else {
          alert("Unkown Error in Player Activate");
        }
      }
    }
    else {
      $scope.gameMessage = "Button Locked until, Action Complete";
    }
  };

  $scope.beep = function(buttonType) {
    var audioUrl = 'https://s3.amazonaws.com/freecodecamp/simonSound' + (buttonType + 1)  + '.mp3';
    var audio = new Audio(audioUrl);
    audio.play();
  };

  $scope.startGame = function() {
    $scope.buttonLock = true;
    $scope.gameMessage = "Game Started";
    for (var i = 0; i < 20; i++) {
      var randomNumber = Math.floor(Math.random() * 4);
      $scope.masterSequence.push(randomNumber);
    }
    var counter = 0;
    $scope.flash = function() {
      if (counter >= 19) {
        $scope.buttonLock = false;
        $scope.stopShow();
        return;
      }
      $scope.activate($scope.masterSequence[counter]);
      counter++;
    }

    $scope.startShow = function() {
      $scope.patternRun = setInterval($scope.flash, 1000);
    }

    $scope.stopShow = function() {
      clearInterval($scope.patternRun);
    }
    $scope.startShow();
  };

  $scope.hint = function() {
    var hintHandler;
    var hintLimit = $scope.stepCount + 1;
    var hintCounter = 0;

    var startHint = function() {
      if ($scope.buttonLock === true) {
        $scope.gameMessage = "Wait until action complete for hint";
      }
      else {
        hintHandler = setInterval(hintTick, 1000);
      }
    };

    var hintTick = function() {
      if (hintCounter > hintLimit) {
        $scope.buttonLock = false;
        clearInterval(hintHandler);
      }
      $scope.activate($scope.masterSequence[hintCounter]);
      hintCounter++;
    }
    $scope.gameMessage = "Flashing a Hint!";
    startHint();
  };

  $scope.resetGame = function() {
    $scope.buttonLock = true;
    $scope.masterSequence = [];
    $scope.inputSequence = [];
    $scope.stepCount = 0;
  };

});
