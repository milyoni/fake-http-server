require("./");
var support = projRequire("/spec/support")
  , fakeHttpServer = projRequire("/index").create()
  , request = require("request");

require("jasmine-node-support").exec(__filename);

describe("http", function() {
  beforeEach(function(done) {
    fakeHttpServer.reset(done);
  });

  afterEach(function(done) {
    fakeHttpServer.reset(done);
  });

  describe("GET", function() {
    describe("entry in redis exists", function() {
      beforeEach(function(done) {
        fakeHttpServer.get(support.testServer + "/foobar", {}, {
          statusCode: 200,
          body: "baz"
        }, function(err) {
          expect(err).toBeFalsy();
          if (err) {
            done();
          } else {
            done();
          }
        });
      });
      it("responds with what is in redis", function(done) {
        request.get(
          support.testServer + "/foobar",
          {},
          function(err, response, body) {
            expect(err).toBeFalsy();
            if (!err) {
              expect(response.statusCode).toEqual(200);
              expect(body).toEqual("baz");
            }
            done();
          }
        );
      });
      it("updates the request count", function(done) {
        request.get(
          support.testServer + "/foobar",
          {},
          function(err, response, body) {
            expect(err).toBeFalsy();
            fakeHttpServer.getRequests(support.testServer + "/foobar", {}, function(err, count) {
              expect(count).toEqual('1');
            })
            done();
          }
        );
      })
    });

    describe("entry in redis does not exist", function() {
      it("responds with a 404", function(done) {
        request.get(
          support.testServer + "/foobar",
          {},
          function(error, response, body) {
            expect(error).toBeFalsy();
            if (!error) {
              expect(response.statusCode).toEqual(404);
            }
            done();
          }
        );
      });
    });
  });

  describe("PUT", function() {
    describe("entry in redis exists", function() {
      beforeEach(function(done) {
        fakeHttpServer.put(support.testServer + "/foobar", {}, {
          statusCode: 200,
          body: "baz"
        }, function(error) {
          expect(error).toBeFalsy();
          done();
        });

      });
      it("responds with what is in redis", function(done) {
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
      it("updates the request count", function(done) {
        request.put(
          support.testServer + "/foobar",
          {},
          function(err, response, body) {
            expect(err).toBeFalsy();
            fakeHttpServer.putRequests(support.testServer + "/foobar", {}, function(err, count) {
              expect(count).toEqual('1');
            })
            done();
          }
        );
      })

    });

    describe("entry in redis does not exist", function() {
      it("responds with a 404", function(done) {
        request.put(
          support.testServer + "/foobar",
          {},
          function(error, response, body) {
            expect(error).toBeFalsy();
            if (!error) {
              expect(response.statusCode).toEqual(404);
            }
            done();
          }
        );
      });
    });
  });

  describe("POST", function() {
    describe("entry in redis exists", function() {
      beforeEach(function(done) {
        fakeHttpServer.post(support.testServer + "/foobar", {body: {'foo': 'bar'}}, {
          statusCode: 200,
          body: "baz"
        }, function(error) {
          expect(error).toBeFalsy();
          done();
        });
      });
      describe("with correct body params", function() {
        it("responds with what is in redis", function(done) {
          request.post(
            support.testServer + "/foobar",
            {form: {'foo': 'bar'}},
            function(error, response, body) {
              expect(error).toBeFalsy();
              if (!error) {
                expect(body).toEqual("baz");
              }
              done();
            }
          );
        });
        it("updates the request count", function(done) {
          request.post(
            support.testServer + "/foobar",
            {form: {'foo': 'bar'}},
            function(err, response, body) {
              expect(err).toBeFalsy();
              fakeHttpServer.postRequests(support.testServer + "/foobar", {}, function(err, count) {
                expect(count).toEqual('1');
              })
              done();
            }
          );
        })
      });

      describe("with incorrect body params", function() {
        it("responds with a 404", function(done) {
          request.post(
            support.testServer + "/foobar",
            {},
            function(error, response, body) {
              expect(error).toBeFalsy();
              if (!error) {
                expect(response.statusCode).toEqual(404);
              }
              done();
            }
          );
        });

        it("does not increment the request count", function(done) {
          request.post(
            support.testServer + "/foobar",
            {},
            function(err, response, body) {
              expect(err).toBeFalsy();
              fakeHttpServer.postRequests(support.testServer + "/foobar", {}, function(err, count) {
                expect(count).toEqual('0');
              })
              done();
            }
          );
        })
      });
    });

    describe("entry in redis does not exist", function() {
      it("responds with a 404", function(done) {
        request.post(
          support.testServer + "/foobar",
          {},
          function(error, response, body) {
            expect(error).toBeFalsy();
            if (!error) {
              expect(response.statusCode).toEqual(404);
            }
            done();
          }
        );
      });
    });
  });

  describe("DELETE", function() {
    describe("entry in redis exists", function() {
      beforeEach(function(done) {
        fakeHttpServer.del(support.testServer + "/foobar", {}, {
          statusCode: 200,
          body: "baz"
        }, function(error) {
          expect(error).toBeFalsy();
          done();
        });

      });
      it("responds with what is in redis", function(done) {
        request.del(
          support.testServer + "/foobar",
          function(error, response, body) {
            expect(error).toBeFalsy();
            if (!error) {
              expect(body).toEqual("baz");
            }
            done();
          }
        );
      });
      it("updates the request count", function(done) {
        request.del(
          support.testServer + "/foobar",
          function(err, response, body) {
            expect(err).toBeFalsy();
            fakeHttpServer.delRequests(support.testServer + "/foobar", {}, function(err, count) {
              expect(count).toEqual('1');
            })
            done();
          }
        );
      })
    });

    describe("entry in redis does not exist", function() {
      it("responds with a 404", function(done) {
        request.del(
          support.testServer + "/foobar",
          function(error, response, body) {
            expect(error).toBeFalsy();
            if (!error) {
              expect(response.statusCode).toEqual(404);
            }
            done();
          }
        );
      });
    });
  });
});
