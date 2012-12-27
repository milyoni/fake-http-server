var redis = require("redis-url")
  , _ = require("underscore")._;

function FakeHttpServer(redisUrl) {
  this.redisUrl = redisUrl || FakeHttpServer.defaultRedisUrl;
};

FakeHttpServer.prototype = {};
["get", "put", "post", "del", "reset"].forEach(function(method) {
  FakeHttpServer.prototype[method] = function() {
    return FakeHttpServer[method].apply(FakeHttpServer, [this.redisUrl].concat(arguments));
  };
});

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
FakeHttpServer.get = function(redisUrl, url, response, callback) {
  handler(redisUrl, "GET", url, response, callback);
};
FakeHttpServer.put = function(redisUrl, url, response, callback) {
  handler(redisUrl, "PUT", url, response, callback);
};
FakeHttpServer.post = function(redisUrl, url, response, callback) {
  handler(redisUrl, "POST", url, response, callback);
};
FakeHttpServer.del = function(redisUrl, url, response, callback) {
  handler(redisUrl, "DELETE", url, response, callback);
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
