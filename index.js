var redis = require("redis-url")
  , _ = require("underscore")._;

function FakeHttpServer(redisUrl) {
  this.redisUrl = redisUrl || FakeHttpServer.defaultRedisUrl;
};

FakeHttpServer.prototype = {
  get: function() {
    return FakeHttpServer.get(this.redisUrl);
  },
  put: function() {
    return FakeHttpServer.put(this.redisUrl);
  },
  post: function() {
    return FakeHttpServer.post(this.redisUrl);
  },
  del: function() {
    return FakeHttpServer.del(this.redisUrl);
  },
  reset: function() {
    return FakeHttpServer.reset(this.redisUrl);
  }
};

var redisHeader = "fake-http-server:";
FakeHttpServer.defaultRedisUrl = "127.0.0.1::6379";
FakeHttpServer.key = function(method, url) {
  return redisHeader + method.toUpperCase() + ":" + url;
};
var handler = function(method, url, response, callback) {
  callback = callback || function() {};
  var redisClient = FakeHttpServer.createClient(redisUrl);
  redisClient.set(FakeHttpServer.key(method, url), JSON.stringify(response), function(err) {
    if (err) {
      callback(err);
    } else {
      callback();
    }
  });
};
FakeHttpServer.get = function(url, response, callback) {
  handler("GET", url, response, callback);
};
FakeHttpServer.put = function(url, response, callback) {
  handler("PUT", url, response, callback);
};
FakeHttpServer.post = function(url, response, callback) {
  handler("POST", url, response, callback);
};
FakeHttpServer.del = function(url, response, callback) {
  handler("DELETE", url, response, callback);
};

FakeHttpServer.reset = function(redisUrl, callback) {
  var redisClient = FakeHttpServer.createClient(redisUrl);
  callback = callback || function() {};
  redisClient.keys(redisHeader + ":*", function(err, keys) {
    if (err) {
      callback(err);
    } else {
      var errors = [];
      var step1 = function() {
        _.times(keys.length, step2);
        keys.forEach(function(key) {
          redisClient.del(key, function(err, callback) {
            if (err) {
              errors.push(err);
            }
            step2();
          });
        });
      };
      var step2 = function() {
        if (errors.length > 0) {
          callback(errors);
        } else {
          callback();
        }
      };
      step1();
    }
  });
};
FakeHttpServer.redisClient = function(redisUrl) {
  return redis.createClient(redisUrl || FakeHttpServer.defaultRedisUrl);
};

module.exports = FakeHttpServer;
