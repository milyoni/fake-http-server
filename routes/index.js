var _ = require('underscore')._
  , routes = require("express-http-routes")
  , redis = require("redis-url");

_.extend(module.exports, routes);

var handler = function(req, res) {
};
_.extend(routes.all, {
  "GET *": handler,
  "POST *": handler,
  "PUT *": handler,
  "DELET *": handler
});
