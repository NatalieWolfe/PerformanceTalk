
const benchmark = require('../lib/benchmark')

class MyObject {
  toJSON() { return undefined }
}

benchmark('toJSON', () => {
  // class MyObject {
  //   toJSON() { return undefined }
  // }

  const test = {a: 1, b: 2, c: 3}

  // Use a class that can't be serialized using `JSON.stringify()`.
  test.property = new MyObject()

  return test
})
