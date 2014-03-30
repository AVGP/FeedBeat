angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Feeds) {
  $scope.articles = [];

  Feeds.getAllEntries(function(err, result) {  
    $scope.$apply(function() {
      for(var i=0; i<result.feed.entries.length;i++) {
        $scope.articles.push(result.feed.entries[i]);
      }
    });
  });
})

.controller('FeedsCtrl', function($scope, $firebase) {
  var ref = new Firebase('https://feedbeat.firebaseio.com/');
  $scope.feeds = $firebase(ref);
  
  $scope.addFeed = function() {
    $scope.feeds.$add({title: window.prompt('Enter title:'), url: window.prompt('Enter URL')})
  }
})

.controller('FavouritesCtrl', function($scope) {
})

.controller('AccountCtrl', function($scope, $rootScope, $firebase, $firebaseSimpleLogin) {
  var ref = new Firebase('https://feedbeat.firebaseio.com/');
  $rootScope.auth = $firebaseSimpleLogin(ref);
  
  $scope.logon = function() {
    $rootScope.auth.$login('password', { email: $scope.email, password: $scope.password }).then(
      function onSuccess(user) {
        console.log('Logged in!', user);
      },
      function onError(error) {
        console.log("Error:", error);
        if(error.code == 'INVALID_EMAIL') {
          $rootScope.auth.$createUser($scope.email, $scope.password).then(function success(user) {
            console.log(user);
          }, function error(error) {
            console.log(error);
          });
        }
      }
    );
  };
});
