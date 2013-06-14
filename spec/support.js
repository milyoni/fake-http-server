process.env.NODE_ENV = process.env.NODE_ENV || "test";

var config = require("../config");
exports.config = config;
exports.port = config.port;
exports.testServer = "http://localhost:" + exports.port;
