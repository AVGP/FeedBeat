angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Feeds', function($rootScope, $firebase, $firebaseSimpleLogin) {
  var feeds = [];
  var self = {
    getAll: function() { return feeds; },
    loadEntries: function(feedIndex, maxItems, callback) {
      var feed = new google.feeds.Feed(feeds[feedIndex].url);
      feed.setNumEntries(maxItems);
      feed.load(callback);
    },
    init: function(uid) {
      var ref = new Firebase('https://feedbeat.firebaseio.com/' + uid);
      feeds = $firebase(ref);
    },
    getAllEntries: function(callback) {
      feeds.$on('loaded', function() {
        feeds.$getIndex().forEach(function(key){
          self.loadEntries(key, 3, function(result) {
            if(result.error) {
              callback(result.error);
              return;
            }
            
            callback(undefined, {data: result, feedId: key});
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
      },
      function onError(error) {
        if(error.code == 'INVALID_USER') {
          auth.$createUser(email, password, false).then(function success(user) {
          }, function error(error) {
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
