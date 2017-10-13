
const {Suite} = require('benchmark')

var _onTestCb = null

module.exports = exports = function(name, test) {
  const suite = new Suite()
  suite.code = test.toString()
  suite.add(name, test)
  _onTestCb(suite)
}

exports.onTest = function(cb) {
  _onTestCb = cb
}
