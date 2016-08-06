'use strict'

var twitchApp = angular.module('twitchApp', []);

twitchApp.factory('getTwitch', function($http, $q) {
  return {
    twitchLookup: function() {
      var promise1 = $http.get("https://api.twitch.tv/kraken/streams/ESL_SC2");
      var promise2 = $http.get("https://api.twitch.tv/kraken/streams/freecodecamp");
      var promise3 = $http.get("https://api.twitch.tv/kraken/streams/test_channel");
      return $q.all([promise1, promise2, promise3]).then(function(results) {
        return results; 
      })
    }
  }
});


twitchApp.controller('TwitchCtrl', function($scope, getTwitch) {
  $scope.status = false;

  getTwitch.twitchLookup().then(function(data) {
    if (streamIsValidated(data)) {
      return $scope.streamData = data;
    }
    throw "Stream Data is Not Validated Error";
  });

  $scope.getStyle = function(streamData) {
    if (streamData) {
      return {
        'background-color': 'green'
      }
    }
    else {
      return {
        'background-color': 'blue'
      }
    }
  };

  $scope.displayLink = function(streamData) {
    if (streamData) {
      return streamData
    }
    else {
      return "is not currently broadcasting";
    }
  };

});

//API Validation Helper Function 
var streamIsValidated = function(streamData) {
  if (typeof streamData[0].data._links.channel === 'string') {
    return true;
  }
  return false
}



