var _ = require('underscore')._
  , errors = require("express-errors")
  , routes = require("express-http-routes")
  , redis = require("redis-url")
  , url = require("url");

_.extend(module.exports, routes);

var handler = function(req, res, next) {
  var protocol = req.headers.x_forwarded_proto || "http";
  var key = [
    "fake-http-server",
    req.method.toUpperCase(),
    protocol + "://" + req.headers.host + req.path + url.format({query: req.query})
  ].join(":");
  var redisClient = redis.createClient();
  redisClient.get(key, function(error, json) {
    try {
      if (json) {
        var data = JSON.parse(json);
        res.send(data.statusCode, data.body);
        res.end();
      } else {
        next(errors.NotFound);
      }
    } catch(e) {
      next(e);
    } finally {
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
