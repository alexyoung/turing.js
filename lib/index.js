var turing = require(__dirname + '/../turing.core.js').turing;
require(__dirname + '/../turing.promise.js')(turing);
require(__dirname + '/../turing.enumerable.js')(turing);

module.exports = turing;
