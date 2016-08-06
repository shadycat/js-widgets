'use strict'

var timerApp = angular.module('timerApp', []);

  timerApp.controller('TimerCtrl', function($scope, $timeout, $interval) {

    $scope.timeLeft = 2500; 
    $scope.countState = false; 
    $scope.buttonState = false;
    $scope.customTime;
    $scope.buttonLock;

    $scope.timeTick = function() {
      if ($scope.timeLeft > 0) {
        return $scope.timeLeft = $scope.timeLeft - 1;
      }
      alert("Time is UP Start the Timer Again");
      $scope.timeLeft = 2500;
      $scope.stopCount();
    };

    $scope.startTime = function() {
      $scope.buttonLock = true;
      $scope.countDown = $interval($scope.timeTick, 1000);
    };

    $scope.stopCount = function() {
      $interval.cancel($scope.countDown)
      $scope.buttonLock = false;
    };

    $scope.resetTimer = function() {
      $scope.stopCount();
      $scope.timeLeft = 2500;
      $scope.buttonLock = false;
    };

    $scope.setTimer = function(customTime) {
      $scope.timeLeft = customTime;
      $scope.customTime = "Enter a Custom Time"
    };

  });   
