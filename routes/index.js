var _ = require('underscore')._
  , errors = require("express-errors")
  , routes = require("express-http-routes")
  , redis = require("redis-url")
  , url = require("url")
  , fakeHttpServer = require("../index.js");

_.extend(module.exports, routes);

var handler = function(req, res, next) {
  var protocol = req.headers.x_forwarded_proto || "http";
  var u = protocol + "://" + req.headers.host + req.path + url.format({query: req.query});
  var key = fakeHttpServer.key(req.method, u, {body: req.body});
  var requestsKey = fakeHttpServer.requestsKey(req.method, u, {body: req.body});
  var redisClient = redis.createClient();
  redisClient.get(key, function(err, json) {
    try {
      if (err) {
        next(err);
        redisClient.end();
      } else {
        if (json) {
          var data = JSON.parse(json);
          redisClient.incr(requestsKey, function(error, count) {
            res.send(data.statusCode, data.body);
            res.end();
            redisClient.end();
          });
        } else {
          next(errors.NotFound);
          redisClient.end();
        }
      }
    } catch (e) {
      next(e);
      redisClient.end();
    }
  });
};
_.extend(routes.all, {
  "GET *": handler,
  "POST *": handler,
  "PUT *": handler,
  "DELETE *": handler
});
