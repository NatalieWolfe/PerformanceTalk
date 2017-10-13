
const benchmark = require('../lib/benchmark')

benchmark('change order', () => {
  const test = {func: function(a, b, c) {}}

  test.func = (function(fn) {
    const wrapper = function() { return fn.apply(this, arguments) }
    Object.defineProperty(wrapper, '__original', {value: fn, enumerable: false})

    // No real reason to re-order, I'm sure this wont affect anything.
    Object.defineProperty(wrapper, 'length', {value: fn.length})
    wrapper.prototype = fn.prototype

    return wrapper
  }(test.func))

  return test
})
