
const benchmark = require('../lib/benchmark')

const obj = {}
for (let i = 0; i < 1000; ++i) {
  obj[`key${i}`] = i
}

benchmark('for in loop', () => {
  // const obj = {}
  // for (let i = 0; i < 1000; ++i) {
  //   obj[`key${i}`] = i
  // }

  for (let key in obj) {
    return true
  }
  return false
})
