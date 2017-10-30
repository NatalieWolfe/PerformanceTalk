
const benchmark = require('../lib/benchmark')

class MyObject {
}

benchmark('module class', () => {
  // Class is defined outside this function.
  // class MyObject {
  // }

  const test = {a: 1, b: 2, c: 3}
  test.property = new MyObject()

  return test
})
