
const a = require('async')
const fs = require('fs')
const path = require('path')

const benchmark = require('./lib/benchmark')

const groups = [
  'function-wrapping'
]

a.eachSeries(groups, (group, cb) => {
  const dir = path.resolve(group)
  const cleanGroup = group.replace(
    /\b([^\w]*\w)/g,
    (m) => ((m.length > 1 ? ' ' : '') + m[m.length - 1].toUpperCase())
  )

  a.waterfall([
    a.apply(fs.readdir, dir),
    (files, cb) => {
      console.log(cleanGroup)
      a.mapSeries(files, a.apply(runBench, dir), (err, results) => {
        console.log('\033c')
        results.unshift(cleanGroup)
        console.log(results.join('\n    '))
      })
    }
  ], cb)
}, (err) => {
  if (err) {
    console.error('Oooops!', err)
  }
})

function runBench(dir, file, cb) {
  benchmark.onTest((test) => {
    let out = null

    console.log('\033c')
    console.log(test.code)
    test.on('cycle', (event) => console.log(out = event.target.toString()))
    test.run()
    console.log('')
    setTimeout(cb, 5000, null, out)
  })
  require(path.join(dir, file))
}
