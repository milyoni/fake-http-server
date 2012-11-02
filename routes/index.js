var _ = require('underscore')._
  , errors = require("express-errors")
  , routes = require("express-http-routes")
  , redis = require("redis-url");

_.extend(module.exports, routes);

var handler = function(req, res, next) {
  var key = ["fake-http-server", req.method.toUpperCase(), req.path].join(":");
  var redisClient = redis.createClient();
  redisClient.get(key, function(error, json) {
    if (json) {
      var data = JSON.parse(json);
      res.send(data.status || 200, data.body || "");
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
