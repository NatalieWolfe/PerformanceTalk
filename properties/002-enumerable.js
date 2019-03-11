
const benchmark = require('../lib/benchmark')

class MyObject {
}

benchmark('non-enumerable', () => {
  // class MyObject {
  // }

  const test = {a: 1, b: 2, c: 3}

  // Make the property non-enumerable so it is hidden when serialized.
  Object.defineProperty(test, 'property', {
    enumerable: false,
    value: new MyObject()
  })

  return test
})
