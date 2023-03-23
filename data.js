/**
 * Base file for CRUD operations on the file system
 */

// Dependencies
const fs = require('fs')
const path = require('path')

// Container for the module
const data = {}

// Define the base directory for storing data
const basePath = path.join(__dirname, '..', 'data')

/**
 * Create a new file and write data to it
 * @param {string} folder - The name of the folder in which to create the file
 * @param {string} file - The name of the file to create
 * @param {object} data - The data to write to the file
 * @param {function} callback - A function to call after the file is created
 */
data.create = function (folder, file, data, callback) {
  // Open the file for writing
  fs.open(`${basePath}/${folder}/${file}.json`, 'wx', function (err, fd) {
    if (!err && fd) {
      // Convert the data to a string
      const stringData = JSON.stringify(data)

      // Write the data to the file
      fs.writeFile(fd, stringData, function (err) {
        if (!err) {
          // Close the file
          fs.close(fd, function (err) {
            if (!err) {
              callback(false)
            } else {
              callback('Error closing new file')
            }
          })
        } else {
          callback('Error writing to new file')
        }
      })
    } else {
      callback('Could not create new file, it may already exist')
    }
  })
}

/**
 * Read data from a file
 * @param {string} folder - The name of the folder containing the file
 * @param {string} file - The name of the file to read
 * @param {function} callback - A function to call with the file data
 */
data.read = function (folder, file, callback) {
  // Read the file
  fs.readFile(`${basePath}/${folder}/${file}.json`, 'utf8', function (err, data) {
    if (!err && data) {
      // Parse the data to a JavaScript object
      const parsedData = JSON.parse(data)
      callback(false, parsedData)
    } else {
      callback('Error reading file')
    }
  })
}

// Update existing data in a file
/**
 * @param {string} folder - Name of the folder containing the file
 * @param {string} file - Name of the file to update
 * @param {object} data - Data to update the file with
 * @param {function} callback - Callback function to run after updating the file. Will return a boolean value indicating success or failure.
 */
data.update = function (folder, file, data, callback) {
    // Open the file for writing
    fs.open(basePath + folder + "/" + file + '.json', function (err, filedescriptor) {
        if (!err && filedescriptor) {
            // If the file is successfully opened, write the new data to the file
            fs.writeFile(basePath + folder + "/" + file + '.json', JSON.stringify(data), function (err) {
                if (!err) {
                    // If the write is successful, close the file and run the callback with a true value to indicate success
                    fs.close(filedescriptor, function (err) {
                        if (!err) {
                            callback(true)
                        } else {
                            callback(false)
                        }
                    })
                } else {
                    // If the write fails, run the callback with a false value to indicate failure
                    callback(false)
                }
            })
        } else {
            // If the file cannot be opened, run the callback with a false value to indicate failure
            callback(false)
        }
    })
}

// Delete a file
/**
 * @param {string} folder - Name of the folder containing the file to delete
 * @param {string} file - Name of the file to delete
 * @param {function} callback - Callback function to run after deleting the file. Will return a boolean value indicating success or failure.
 */
data.delete = function (folder, file, callback) {
    // Delete the file
    fs.unlink(basePath + folder + "/" + file + '.json', function (err) {
        if (!err) {
            // If the delete is successful, run the callback with a true value to indicate success
            callback(true)
        } else {
            // If the delete fails, run the callback with a false value to indicate failure
            callback(false)
        }
    })
}
