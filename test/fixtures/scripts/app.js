'use strict';

angular.module('test', [
  'ngRoute'
]).config(function (
  $locationProvider,
  $routeProvider
) {

  $locationProvider
    .html5Mode(true)
    .hashPrefix('!');

  $routeProvider
    .when('/', {
      templateUrl: 'views/root.html'
    })
    .when('/sub', {
      templateUrl: 'views/sub.html'
    })
    .otherwise({
      redirectTo: '/'
    });

}).run(function ($rootScope) {
  $rootScope.$on('$routeChangeSuccess', function (e, next) {
    if (typeof window.callPhantom === 'function') {
      window.callPhantom({ template: next.locals.$template });
    }
  });
});

