'use strict'

var wikiApp = angular.module('wikiApp', []);

  wikiApp.filter('html2text', function() {
    return function(text) {
      return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    }
  });

  wikiApp.factory('getWiki', function($http, $q) {
    return {
      searchWiki: function(query) {
        var wikiUrl = createUrl(query);
        return $http.jsonp(wikiUrl).then(function(data) {
          return data;
        })
      }
    }
  });

  wikiApp.controller('WikiCtrl', function($scope, $rootScope, getWiki) {
    $scope.searchStatus = false;
    this.send = function(wiki) {
      getWiki.searchWiki(wiki.find).then(function(data) {
        var wikiData = data.data.query.search;
        $scope.wikiData = wikiData;
        $scope.searchStatus = true;
      });
    };
  });


function createUrl(query) {
  var baseUrl = 'http://en.wikipedia.org/w/api.php';
  var params = {};
  params.action = 'query';
  params.list = 'search';
  params.srsearch = query;
  params.format = 'json';
  params.prop = 'info';
  params.callback = 'JSON_CALLBACK';
  var paramUrl = baseUrl + '?' + serialize(params);
  return paramUrl;
};

function serialize(params) {
  var urlString = Object.keys(params).map(function(key) {
    return key + '=' + params[key];
  }).join('&');
  return urlString;
};
