
const benchmark = require('../lib/benchmark')

benchmark('prototype', () => {
  const test = {func: function(a, b, c) {}}

  test.func = (function(fn) {
    const wrapper = function() { return fn.apply(this, arguments) }
    Object.defineProperty(wrapper, '__original', {value: fn, enumerable: false})

    // Maybe we're wrapping a constructor. We should bring along the prototype.
    Object.defineProperty(wrapper, 'length', {value: fn.length})
    wrapper.prototype = fn.prototype

    return wrapper
  }(test.func))

  return test
})
