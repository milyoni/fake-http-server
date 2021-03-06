// Server Initialization
var express = require('express'),
  connect = require('connect'),
  path = require('path'),
  app = global.app = express(),
  config = require('./config'),
  routes = require('./routes');

app.configure(function() {
  app.set("config", config);
  app.set('port', config.port);
  app.use(connect.compress());
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.set("redis_url", config.redis_url);
require("./index").defaultRedisUrl = config.redis_url;

routes.attach({app: app});

require('http').createServer(app).listen(app.get('port'), function() {
  var colors = require('colors');
  console.info("[fake-http-server]".blue + "\t" + "listening on port: ".white + app.get('port').toString().green);
});
