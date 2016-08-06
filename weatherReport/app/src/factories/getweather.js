var getWeather = angular.module('getWeather', []);

getWeather.factory('getWeather', function($http, $q) {
  return {
    weatherLookup: function() {
      return $http.get('http://api.openweathermap.org/data/2.5/weather?q=berkeley&APPID=a6ed7e23844c83dfb1d0a05d2861aa6f');
    }   
  }
}); 


