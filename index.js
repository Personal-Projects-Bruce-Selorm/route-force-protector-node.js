// Import dependencies
const data = require('./data');
const { debug } = require('console');

// Define rateLimit function
const rateLimit = function (identifier, callback) {
  const folderPath = "route-force-tracker";
  const maxAttempts = 5;
  const maxTimePeriod = 60; // in seconds
  const banTimePeriod = 60 * 60; // in seconds

  data.read(folderPath, identifier, function (dataObject) {
    debug(dataObject);
    const currentTime = Date.now();

    if (dataObject && dataObject != null) {
      // Check if user's next login attempt time has not expired
      if (dataObject.nextAttempt >= currentTime) {
        const timeLeft = (dataObject.nextAttempt - currentTime) / 1000; // in seconds
        callback(false, { Error: `Please note that due to too many attempts, your account is deactivated for the next ${timeLeft} seconds` });
      } else {
        // Check if user has made too many attempts in the last time period
        const attemptsInTimePeriod = dataObject.attempts.filter(attempt => attempt > (currentTime - (maxTimePeriod * 1000))).length;

        if (attemptsInTimePeriod >= maxAttempts) {
          // Ban user for a certain period of time
          const nextAttemptTime = currentTime + (banTimePeriod * 1000);
          const trackerObject = {
            identifier,
            attempts: [currentTime],
            nextAttempt: nextAttemptTime
          };
          // Persist changes to file
          data.update(folderPath, identifier, trackerObject, function (isUpdated) {
            if (isUpdated) {
              const timeLeft = banTimePeriod;
              callback(false, { Error: `You have made too many attempts. Your account is deactivated for the next ${timeLeft} seconds.` });
            } else {
              callback(false, { Error: "Internal server error, could not update file." });
            }
          });
        } else {
          // User can attempt to login
          dataObject.attempts.push(currentTime);
          // Persist changes to file
          data.update(folderPath, identifier, dataObject, function (isUpdated) {
            if (isUpdated) {
              callback(true, { Success: "User attempt updated in file." });
            } else {
              callback(false, { Error: "Internal server error, could not update file." });
            }
          });
        }
      }
    } else {
      // Create new tracker file for user
      const trackerObject = {
        identifier,
        attempts: [currentTime]
      };
      data.create(folderPath, identifier, trackerObject, function (isCreated) {
        if (isCreated) {
          callback(true, { Success: "Route-force attack tracker was created for user." });
        } else {
          callback(false, { Error: "Internal server error, could not create route-force attack tracker for this user." });
        }
      });
    }
  });
};

// Export rateLimit function
module.exports = rateLimit;
