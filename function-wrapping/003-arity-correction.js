
const benchmark = require('../lib/benchmark')

benchmark('arity-correction', () => {
  const test = {func: function(a, b, c) {}}

  test.func = (function(fn) {
    const wrapper = function() { return fn.apply(this, arguments) }
    Object.defineProperty(wrapper, '__original', {value: fn, enumerable: false})

    // Sometimes arity of a function is important (thanks Express!), so we
    // should fix that.
    Object.defineProperty(wrapper, 'length', {value: fn.length})

    return wrapper
  }(test.func))

  return test
})
