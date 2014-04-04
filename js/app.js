// Ionic Starter App, v0.9.20

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'firebase'])

.run(function($ionicPlatform, $rootScope, $state, $firebaseSimpleLogin) {

  var ref = new Firebase('https://feedbeat.firebaseio.com/');
  $rootScope.auth = $firebaseSimpleLogin(ref);

  $rootScope.$on("$firebaseSimpleLogin:login", function(err, user) {
    $rootScope.user = user; 
  });

    
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
    if(toState.authOnly && !window.loggedIn) {
      $state.go("tab.account");
      event.preventDefault();
    }
  });

  $ionicPlatform.ready(function() {
    //StatusBar.styleDefault();
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-dash.html',
          controller: 'DashCtrl'
        }
      },
      authOnly: true
    })

    .state('tab.feeds', {
      url: '/feeds',
      views: {
        'tab-feeds': {
          templateUrl: 'templates/tab-feeds.html',
          controller: 'FeedsCtrl'
        }
      },
      authOnly: true
    })

    .state('tab.feed', {
      url: '/feed/{feedId}',
      views: {
        'tab-feeds': {
          templateUrl: 'templates/tab-feed.html',
          controller: 'FeedCtrl'
        }
      },
      authOnly: true
    })

    .state('tab.article', {
      url: '/article/:feedIndex/:articleUrl',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-article.html',
          controller: 'ArticleCtrl'
        }
      },
      authOnly: true
    })

    .state('tab.favourites', {
      url: '/favourites',
      views: {
        'tab-favourites': {
          templateUrl: 'templates/tab-favourites.html',
          controller: 'FavouritesCtrl'
        }
      },
      authOnly: true
    })
    
    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});

