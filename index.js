var redis = require("redis-url")
  , _ = require("underscore")._;

function FakeHttpServer(redisUrl) {
  this.redisUrl = redisUrl || FakeHttpServer.defaultRedisUrl;
}

FakeHttpServer.create = function(redisUrl) {
  return new FakeHttpServer(redisUrl);
};

FakeHttpServer.prototype = {};

var redisHeader = "fake-http-server:";
FakeHttpServer.defaultRedisUrl = "127.0.0.1::6379";
FakeHttpServer.key = function(method, url) {
  return redisHeader + method.toUpperCase() + ":" + url;
};
FakeHttpServer.prototype = {
  get: function(url, response, callback) {
    return this.define("GET", url, response, callback);
  },
  put: function(url, response, callback) {
    return this.define("PUT", url, response, callback);
  },
  post: function(url, response, callback) {
    return this.define("POST", url, response, callback);
  },
  del: function(url, response, callback) {
    return this.define("DELETE", url, response, callback);
  },
  define: function(method, url, response, callback) {
    callback = callback || function() {
    };
    var redisClient = FakeHttpServer.redisClient(this.redisUrl);
    response = _.extend({statusCode: 200, text: ""}, response);
    redisClient.set(FakeHttpServer.key(method, url), JSON.stringify(response), function(err) {
      if (err) {
        callback(err);
      } else {
        callback();
      }
      redisClient.end();
    })
  },
  reset: function(callback) {
    callback = callback || function() {};
    var redisClient = FakeHttpServer.redisClient(this.redisUrl);
    redisClient.keys(redisHeader + "*", function(err, keys) {
      if (err) {
        callback(err);
      } else {
        var errors = [];
        var step1 = function() {
          var done = _.after(keys.length, step2);
          try {
            _.each(keys, function(key) {
              redisClient.del(key, function(err) {
                if (err) {
                  errors.push(err);
                }
                done();
              });
            });
          } catch (e) {
            step2();
          }
        };
        var step2 = function() {
          if (errors.length > 0) {
            callback(errors);
          } else {
            callback();
          }
          redisClient.end();
        };
        step1();
      }
    });
  }
};

FakeHttpServer.redisClient = function(redisUrl, callback) {
  return redis.createClient(redisUrl || FakeHttpServer.defaultRedisUrl);
};

module.exports = FakeHttpServer;
