const _ = require('lodash');
const glob = require('glob');

/**
 * Get paths from a glob pattern
 * @param  {string | string[]} globPatterns - One or more glob patterns
 * @param {boolean} excludes - boolean
 * @returns Returns paths to all files matching the glob pattern/s
 */
module.exports.getGlobbedPaths = (globPatterns, excludes) => {
    // URL paths regex
    var urlRegex = new RegExp('^(?:[a-z]+:)?//', 'i');

    // The output array
    var output = [];

    // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
    if (_.isArray(globPatterns)) {
        globPatterns.forEach(globPattern => {
            output = _.union(output, getGlobbedPaths(globPattern, excludes));
        });
    } else if (_.isString(globPatterns)) {
        if (urlRegex.test(globPatterns)) {
            output.push(globPatterns);
        } else {
            const files = glob.sync(globPatterns);
            if (excludes) {
                files = files.map(file => {
                    if (_.isArray(excludes)) {
                        for (let i in excludes) {
                            if (excludes.hasOwnProperty(i)) {
                                file = file.replace(excludes[i], '');
                            }
                        }
                    } else {
                        file = file.replace(excludes, '');
                    }
                    return file;
                });
            }
            output = _.union(output, files);
        }
    }
    return output;
};
