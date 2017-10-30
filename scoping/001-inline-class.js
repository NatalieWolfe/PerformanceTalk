
const benchmark = require('../lib/benchmark')

benchmark('inline class', () => {
  // Class is defined in the function that uses it.
  class MyObject {
  }

  const test = {a: 1, b: 2, c: 3}
  test.property = new MyObject()

  return test
})
