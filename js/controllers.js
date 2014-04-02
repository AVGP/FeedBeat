angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $firebaseSimpleLogin, Feeds) {
  $scope.articles = [];

  var ref = new Firebase('https://feedbeat.firebaseio.com/');
  $scope.auth = $firebaseSimpleLogin(ref);

  $scope.$on("$firebaseSimpleLogin:login", function(err, user) {
    Feeds.init(user.id);
    Feeds.getAllEntries(function(err, result) {
      if(err) {
        alert("Whoops! " + err.message);
      }
      console.log("gAE", err, result);
      $scope.$apply(function() {
        for(var i=0; i<result.data.feed.entries.length;i++) {
          var entry = result.data.feed.entries[i];
          entry.feedId = result.feedId;
          entry.link = btoa(entry.link);
          $scope.articles.push(entry);
        }
      });
    });    
  });
})

.controller('FeedsCtrl', function($scope, $rootScope, $firebase, $firebaseSimpleLogin, $ionicModal) {
  var ref = new Firebase('https://feedbeat.firebaseio.com/');
  $scope.auth = $firebaseSimpleLogin(ref);  

  $scope.$on("$firebaseSimpleLogin:login", function(err, user) {
    var ref = new Firebase('https://feedbeat.firebaseio.com/' + user.id);
    $scope.feeds = $firebase(ref);
  });

  $ionicModal.fromTemplateUrl('add-feed.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  
  $scope.showAddForm = function() {
    $scope.newFeed = {};
    $scope.modal.show();
  };

  $scope.closeAddForm = function() {
    $scope.modal.hide();
  };
  
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.addFeed = function() {
    console.log("SCOPE:", $scope.newFeed.title, $scope.newFeed.url);
    $scope.feeds.$add({title: $scope.newFeed.title, url: $scope.newFeed.url});
    $scope.closeAddForm();
  }
})

.controller('ArticleCtrl', function($scope, $stateParams, $firebaseSimpleLogin, Feeds) {

  var ref = new Firebase('https://feedbeat.firebaseio.com/');
  $scope.auth = $firebaseSimpleLogin(ref);

  $scope.$on("$firebaseSimpleLogin:login", function(err, user) {
    Feeds.init(user.id);
    Feeds.loadEntries($stateParams.feedIndex, 20, function(result) {

      $scope.$apply(function() {
        for(var i=0; i<result.feed.entries.length;i++) {
          var entry = result.feed.entries[i];
          entry.link = btoa(entry.link);
          
          if(entry.link == $stateParams.articleUrl) {
            $scope.title = entry.title;
            $scope.article = entry.content;
          }
        }
      });
    });    
  });

  $scope.articleUrl = $stateParams.articleUrl;
})

.controller('FavouritesCtrl', function($scope) {
})

.controller('AccountCtrl', function($scope, $firebase, $firebaseSimpleLogin) {
  var ref = new Firebase('https://feedbeat.firebaseio.com/');
  $scope.auth = $firebaseSimpleLogin(ref);
  
  $scope.$on("$firebaseSimpleLogin:logout", function() {
    window.loggedIn = false;
  });
  
  $scope.logon = function() {
    $scope.auth.$login('password', { email: $scope.$$childHead.email, password: $scope.$$childHead.password }).then(
      function onSuccess(user) {
        console.log('Logged in!', user);
        window.loggedIn = true;
      },
      function onError(error) {
        console.log("Error:", error);
        if(error.code == 'INVALID_USER') {
          $scope.auth.$createUser($scope.$$childHead.email, $scope.$$childHead.password, false).then(function success(user) {
            console.log(user);
          }, function error(error) {
            console.log(error);
            Bugsense.notify(error, {email: $scope.$$childHead.email});
          });
        }
      }
    );
  };
});
