
const benchmark = require('../lib/benchmark')

benchmark('change order', () => {
  const test = {func: function(a, b, c) {}}

  test.func = (function(fn) {
    const wrapper = function() { return fn.apply(this, arguments) }
    Object.defineProperty(wrapper, '__original', {value: fn, enumerable: false})

    // No real reason to re-order, I'm sure this wont affect anything.
    wrapper.prototype = fn.prototype
    Object.defineProperty(wrapper, 'length', {value: fn.length})

    return wrapper
  }(test.func))

  return test
})
