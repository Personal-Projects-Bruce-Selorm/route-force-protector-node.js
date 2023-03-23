# route-force-protector-node.js

route-force-protector-node.js
route-force-protector-node.js is a package for Node.js that provides a middleware function for enforcing rate limits on incoming requests, in order to prevent brute-force attacks on your server.

The package works by using a file on the server to keep track of each client's attempts and ban status. If a client makes too many requests within a certain time period, they will be banned from making further requests for a specified amount of time.

Usage

const rateLimit = require('route-force-protector-node.js');

app.get('/protected-route', function(req, res) {
  const clientIdentifier = req.ip; // or some other unique identifier for the client
  rateLimit(clientIdentifier, function(isAllowed, result) {
    if (isAllowed) {
      // client is allowed to access the protected route
      res.send('Welcome to the protected route!');
    } else {
      // client has been banned or has made too many requests recently
      res.status(429).send(result.Error);
    }
  });
});


In the example above, if the rateLimit function determines that the client has made too many requests recently, the callback function will return a result object with an Error property indicating that the client has been banned or should wait before making another request.

Configuration
route-force-protector-node.js provides a few configuration options that you can customize to fit your needs. These options can be passed as arguments to the rateLimit function, like so:

rateLimit(identifier, callback, options);


The available options are:

maxAttempts: the maximum number of attempts allowed within a specified time period (default: 5)
maxTimePeriod: the time period (in seconds) during which the maximum number of attempts is allowed (default: 60)
banTimePeriod: the time period (in seconds) for which a client is banned if they exceed the maximum number of attempts (default: 3600)
folderPath: the path to the folder on the server where the rate limit tracker files will be stored (default: 'route-force-tracker')
Contributing
If you find a bug or have a feature request, please open an issue or submit a pull request! We welcome all contributions to this project.

License
This package is released under the MIT License.
