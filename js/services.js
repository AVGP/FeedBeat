angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Feeds', function($rootScope, $firebase, $firebaseSimpleLogin) {
  var feeds = [];
  var self = {
    getAll: function() { return feeds; },
    loadEntries: function(feedIndex, callback) {
      var feed = new google.feeds.Feed(feeds[feedIndex].url);
      feed.setNumEntries(1);
      feed.load(callback);
    },
    init: function(uid) {
      var ref = new Firebase('https://feedbeat.firebaseio.com/' + uid);
      feeds = $firebase(ref);
    },
    getAllEntries: function(callback) {
      feeds.$on('loaded', function() {
        feeds.$getIndex().forEach(function(key){
          self.loadEntries(key, function(result) {
            if(result.error) {
              callback(result.error);
              return;
            }
            
            callback(undefined, result);
          });
        });
      });
    }
  };
  
  return self;
})

.factory('Auth', function($firebaseSimpleLogin) {
  var ref  = new Firebase('https://feedbeat.firebaseio.com/');
  var auth = $firebaseSimpleLogin(ref);
  var self = {};
  
  self.currentUser = function() {
    return auth.user;
  };
  
  self.logon = function(email, password) {
    auth.$login('password', { email: email, password: password, rememberMe: true }).then(
      function onSuccess(user) {
        console.log('Logged in!', user);
      },
      function onError(error) {
        console.log("Error:", error);
        if(error.code == 'INVALID_USER') {
          auth.$createUser(email, password, false).then(function success(user) {
            console.log(user);
          }, function error(error) {
            console.log(error);
          });
        }
      }
    );
    
  };
  
  self.logout = function() {
    auth.$logout();
  };
  
  return self;
});
