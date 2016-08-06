'use strict'

var WeatherCtrl = angular.module('WeatherCtrl', []);

WeatherCtrl.controller('WeatherCtrl', function($scope, $rootScope ,$http, getWeather) {
    $scope.weatherInfo = "Hello"
    getWeather.weatherLookup().success(function(weatherData){
      if (weatherIsValidated(weatherData)) {
        $scope.weatherInfo = weatherData;
        $scope.temp = weatherData.main.temp;
        $scope.location = weatherData.name;
        $scope.status = weatherData.weather[0].description;
        $rootScope.icon = weatherData.weather[0].icon;
      }
      else {
        alert("Weather Data is Invalid");
      }
    })
  });

//Weather Validation Helper
var weatherIsValidated = function(weatherData) {
  if (typeof weatherData.main.temp === 'number') {
    return true;
  }
  return false;
}
