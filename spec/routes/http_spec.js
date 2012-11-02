require("./");
var path = require('path')
  , _ = require('underscore')._
  , Backbone = require('backbone')
  , http = require('http')
  , pipette = require("pipette")
  , support = projRequire("/spec/support")
  , redis = require("redis-url")
  , url = require("url")
  , request = require("request");

require("jasmine-node-support").exec(__filename);

describe("GET", function() {
  var key, redisClient;
  beforeEach(function() {
    key = "fake-http-server:GET:/foobar";
    redisClient = redis.createClient();
  });

  afterEach(function() {
    redisClient.del(key);
    redisClient.end();
  });

  describe("entry in redis exists", function() {
    it("responds with what is in redis", function(done) {
      redisClient.set(key, JSON.stringify({status: 200, body: "baz"}), function(error) {
        expect(error).toBeFalsy();
        request.get(
          support.testServer + "/foobar",
          {},
          function(error, response, body) {
            expect(error).toBeFalsy();
            expect(response.statusCode).toEqual(200);
            expect(body).toEqual("baz");
            done();
          }
        );
      });
    });
  });

  describe("entry in redis does not exist", function() {
    it("responds with a 404", function(done) {
      request.get(
        support.testServer + "/foobar",
        {},
        function(error, response, body) {
          expect(error).toBeFalsy();
          expect(response.statusCode).toEqual(404);
          done();
        }
      );
    });
  });
});

describe("PUT", function() {
  var key, redisClient;
  beforeEach(function() {
    key = "fake-http-server:PUT:/foobar";
    redisClient = redis.createClient();
  });

  afterEach(function() {
    redisClient.del(key);
    redisClient.end();
  });

  describe("entry in redis exists", function() {
    it("responds with what is in redis", function(done) {
      redisClient.set(key, JSON.stringify({status: 200, body: "baz"}), function(error) {
        expect(error).toBeFalsy();
        request.put(
          support.testServer + "/foobar",
          {},
          function(error, response, body) {
            expect(error).toBeFalsy();
            expect(body).toEqual("baz");
            done();
          }
        );
      });
    });
  });

  describe("entry in redis does not exist", function() {
    it("responds with a 404", function(done) {
      request.put(
        support.testServer + "/foobar",
        {},
        function(error, response, body) {
          expect(error).toBeFalsy();
          expect(response.statusCode).toEqual(404);
          done();
        }
      );
    });
  });
});

describe("POST", function() {
  var key, redisClient;
  beforeEach(function() {
    key = "fake-http-server:POST:/foobar";
    redisClient = redis.createClient();
  });

  afterEach(function() {
    redisClient.del(key);
    redisClient.end();
  });

  describe("entry in redis exists", function() {
    it("responds with what is in redis", function(done) {
      redisClient.set(key, JSON.stringify({status: 200, body: "baz"}), function(error) {
        expect(error).toBeFalsy();
        request.post(
          support.testServer + "/foobar",
          {},
          function(error, response, body) {
            expect(error).toBeFalsy();
            expect(body).toEqual("baz");
            done();
          }
        );
      });
    });
  });

  describe("entry in redis does not exist", function() {
    it("responds with a 404", function(done) {
      request.post(
        support.testServer + "/foobar",
        {},
        function(error, response, body) {
          expect(error).toBeFalsy();
          expect(response.statusCode).toEqual(404);
          done();
        }
      );
    });
  });
});

describe("DELETE", function() {
  var key, redisClient;
  beforeEach(function() {
    key = "fake-http-server:DELETE:/foobar";
    redisClient = redis.createClient();
  });

  afterEach(function() {
    redisClient.del(key);
    redisClient.end();
  });

  describe("entry in redis exists", function() {
    it("responds with what is in redis", function(done) {
      redisClient.set(key, JSON.stringify({status: 200, body: "baz"}), function(error) {
        expect(error).toBeFalsy();
        request.del(
          support.testServer + "/foobar",
          function(error, response, body) {
            expect(error).toBeFalsy();
            expect(body).toEqual("baz");
            done();
          }
        );
      });
    });
  });

  describe("entry in redis does not exist", function() {
    it("responds with a 404", function(done) {
      request.del(
        support.testServer + "/foobar",
        function(error, response, body) {
          expect(error).toBeFalsy();
          expect(response.statusCode).toEqual(404);
          done();
        }
      );
    });
  });
});
