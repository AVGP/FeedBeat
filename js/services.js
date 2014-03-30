angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Feeds', function($firebase) {
  var feeds = [];
  var self = {
    getAll: function() { return feeds; },
    loadEntries: function(feedIndex, callback) {
      var feed = new google.feeds.Feed(feeds[feedIndex].url);
      feed.setNumEntries(1);
      feed.load(callback);
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

  var ref = new Firebase('https://feedbeat.firebaseio.com/');
  feeds = $firebase(ref);

  return self;
});
