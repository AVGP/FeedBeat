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

.controller('AccountCtrl', function($scope, $firebaseSimpleLogin) {
  var ref = new Firebase('https://feedbeat.firebaseio.com/');
  $scope.auth = $firebaseSimpleLogin(ref);
});
