var exports = module.exports;

exports.port = process.env.PORT || 3006;
exports.redis_url = process.env.REDIS_URL || "redis://localhost:6379/";

var projectDir = __dirname;
global.projRequire = function(module) {
  return require(projectDir + module);
};
