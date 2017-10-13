
const benchmark = require('../lib/benchmark')

benchmark('store original', () => {
  const test = {func: function(a, b, c) {}}

  test.func = (function(fn) {
    const wrapper = function() { return fn.apply(this, arguments) }

    // Sometimes you need to unwrap things, so store the original value.
    Object.defineProperty(wrapper, '__original', {value: fn, enumerable: false})

    return wrapper
  }(test.func))

  return test
})
