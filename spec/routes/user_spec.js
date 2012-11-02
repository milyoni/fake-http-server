require("./");
var path = require('path')
  , _ = require('underscore')._
  , Backbone = require('backbone')
  , http = require('http')
  , pipette = require("pipette")
  , support = projRequire("/spec/support")
  , pgSimple = require("pg-simple");

require("jasmine-node-support").exec(__filename);

describe("GET /me", function() {
  describe("given a valid access_code", function() {
    it("responds with the saved user", function() {
      var request = http.request({method: "POST", path: "/me"});

      http.get(support.testServer + "/users", function(res) {
        (new pipette.Sink(res)).on("data", function(sinkData) {
          var data = JSON.parse(sinkData.toString());
          expect(data).toEqual([]);
          done();
        });
      });
    });
  });
});
