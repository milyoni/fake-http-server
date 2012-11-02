fake-http-api-server
============

Fake http api server based on a shared redis database.

# Usage

    var redis = require("redis-url")
      , request = require("request");

    redisClient = redis.createClient();
    redisClient.set("fake-http-server:GET:/foobar", JSON.stringify({status: 200, body: "baz"}));

    request.get(
      support.testServer + "/foobar",
      {},
      function(error, response, body) {
        console.info(response.statusCode); // 200
        console.info(body); // "baz"
      }
    );
