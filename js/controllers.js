angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $rootScope, Feeds) {
  $scope.articles = [];
  $scope.loading = true;

  $rootScope.$watch('user', function(user) {
    Feeds.init(user.id);
    Feeds.getAllEntries(function(err, result) {
      if(err) {
        alert("Whoops! " + err.message);
        $scope.loading = false;
      }
      $scope.$apply(function() {
        for(var i=0; i<result.data.feed.entries.length;i++) {
          var entry = result.data.feed.entries[i];
          entry.feedId = result.feedId;
          entry.link = btoa(entry.link);
          $scope.articles.push(entry);
        }
        $scope.loading = false;
      });
    });    
  });
})

.controller('FeedCtrl', function($scope, $rootScope, $stateParams, Feeds) {
  $scope.articles = [];
  $scope.loading = true;


  $rootScope.$watch("user", function(user) {
    Feeds.init(user.id);
    Feeds.loadEntries($stateParams.feedId, 20, function(result) {
      $scope.$apply(function() {
        for(var i=0; i<result.feed.entries.length;i++) {
          var entry    = result.feed.entries[i];
          entry.link   = btoa(entry.link);
          entry.feedId = $stateParams.feedId;
          $scope.articles.push(entry)
        }
        $scope.title = result.feed.title;
        $scope.loading = false;
      });
    });
  });
})

.controller('FeedsCtrl', function($scope, $rootScope, $firebase, $ionicModal) {
  $scope.loading = true;

  $rootScope.$watch("user", function(user) {
    var ref   = new Firebase('https://feedbeat.firebaseio.com/' + user.id),
        feeds = $firebase(ref);

    feeds.$on('loaded', function() {
      feeds.$getIndex().forEach(function(index) {
        feeds[index].id = index;
      });
      $scope.feeds = feeds;
      $scope.loading = false;
    });
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
    $scope.feeds.$add({title: $scope.newFeed.title, url: $scope.newFeed.url});
    $scope.closeAddForm();
  }
})

.controller('ArticleCtrl', function($scope, $stateParams, $firebaseSimpleLogin, Feeds) {

  var ref = new Firebase('https://feedbeat.firebaseio.com/');
  $scope.auth = $firebaseSimpleLogin(ref);
  $scope.loading = true;

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
          $scope.loading = false;
        }
      });
    });    
  });

  $scope.articleUrl = $stateParams.articleUrl;
})

.controller('FavouritesCtrl', function($scope) {
})

.controller('AccountCtrl', function($scope, $rootScope, $firebase, $firebaseSimpleLogin) {
  var ref = new Firebase('https://feedbeat.firebaseio.com/');
  $scope.auth = $firebaseSimpleLogin(ref);
  
  $scope.$on("$firebaseSimpleLogin:logout", function() {
    console.log('LOGOUT');
    window.loggedIn = false;
  });

  $scope.$on("$firebaseSimpleLogin:login", function() {
    console.log('LOGIN');
    window.loggedIn = true;
  });

  $scope.logon = function() {
    $scope.loading = true;
    $scope.auth.$login('password', { email: $scope.$$childHead.email, password: $scope.$$childHead.password }).then(
      function onSuccess(user) {
          $scope.loading = false;
      },
      function onError(error) {
        if(error.code == 'INVALID_USER') {
          $scope.auth.$createUser($scope.$$childHead.email, $scope.$$childHead.password, false).then(function success(user) {},
          function error(error) {
            Bugsense.notify(error, {email: $scope.$$childHead.email});
            $scope.loading = false;
          });
        }
      }
    );
  };
});
