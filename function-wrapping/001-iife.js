
const benchmark = require('../lib/benchmark')

benchmark('iife', () => {
  const test = {func: function(a, b, c) {}}

  // This is the most basic form of function wrapping, nothing fancy happening.
  test.func = (function(fn) {
    const wrapper = function() { return fn.apply(this, arguments) }
    return wrapper
  }(test.func))

  return test
})
