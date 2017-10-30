
const benchmark = require('../lib/benchmark')

class MyObject {
}

benchmark('assignment', () => {
  // class MyObject {
  // }

  const test = {a: 1, b: 2, c: 3}

  // Simply add a property to an object.
  test.property = new MyObject()

  return test
})
