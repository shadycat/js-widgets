'use strict'

var calcApp = angular.module('calcApp', []);

calcApp.controller('CalcCtrl', function($scope) {

  $scope.initial = [0];
  $scope.master = $scope.initial;

  $scope.input = function(buttonData) {
    $scope.master.push(buttonData);
  };

  $scope.clear = function() {
    angular.copy($scope.inital, $scope.master);
  };

  $scope.eval = function() {
    var evalString = $scope.master.join("");
    var answer = eval(evalString);
    $scope.master = [answer];
  };

});






