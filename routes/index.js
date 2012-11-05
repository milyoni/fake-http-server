var _ = require('underscore')._
  , errors = require("express-errors")
  , routes = require("express-http-routes")
  , redis = require("redis-url")
  , url = require("url");

_.extend(module.exports, routes);

var handler = function(req, res, next) {
  var key = ["fake-http-server", req.method.toUpperCase(), req.path + url.format({query: req.query})].join(":");
  var redisClient = redis.createClient();
  redisClient.get(key, function(error, json) {
    if (json) {
      res.send(200, json);
      res.end();
    } else {
      next(errors.NotFound);
    }
    redisClient.end();
  });
};
_.extend(routes.all, {
  "GET *": handler,
  "POST *": handler,
  "PUT *": handler,
  "DELETE *": handler
});
