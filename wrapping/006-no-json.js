
const benchmark = require('../lib/benchmark')

class Original {
  constructor(value) {
    this.value = value
  }

  toJSON() { return undefined }
}

benchmark('no toJSON', () => {
  // class Original {
  //   constructor(value) {
  //     this.value = value
  //   }
  //
  //   toJSON() { return undefined }
  // }

  const test = {func: function(a, b, c) {}}

  test.func = (function(fn) {
    const wrapper = function() { return fn.apply(this, arguments) }

    // Use the no JSON trick to avoid serialization.
    wrapper.__original = new Original(fn)

    wrapper.prototype = fn.prototype
    Object.defineProperty(wrapper, 'length', {value: fn.length})

    return wrapper
  }(test.func))

  return test
})
