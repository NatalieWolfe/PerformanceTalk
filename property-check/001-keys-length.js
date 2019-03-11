
const benchmark = require('../lib/benchmark')

const obj = {}
for (let i = 0; i < 1000; ++i) {
  obj[`key${i}`] = i
}

benchmark('object keys length', () => {
  // const obj = {}
  // for (let i = 0; i < 1000; ++i) {
  //   obj[`key${i}`] = i
  // }

  return !!Object.keys(obj).length
})
