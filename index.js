
const a = require('async')
const blessed = require('blessed')
const cardinal = require('cardinal')
const fs = require('fs')
const path = require('path')

const benchmark = require('./lib/benchmark')


const groups = [
  'function-wrapping'
]

a.series([
  loadAllGroups,
  runAllGroups
], (err) => {
  if (err) {
    console.error('Oooops!', err)
  }
})

function loadAllGroups(cb) {
  process.stdout.write('Loading')
  a.each(groups, (group, cb) => {
    const dir = path.resolve(group)
    const cleanGroup = group.replace(
      /\b([^\w]*\w)/g,
      (m) => ((m.length > 1 ? ' ' : '') + m[m.length - 1].toUpperCase())
    )
    benchmark.startGroup(cleanGroup)

    a.waterfall([
      a.apply(fs.readdir, dir),
      (files, cb) => {
        files.forEach((file) => {
          process.stdout.write('.')
          require(path.join(dir, file))
        })
        setImmediate(cb)
      }
    ], cb)
  }, cb)
}

function runAllGroups(cb) {
  const screen = blessed.screen({smartCSR: true})
  const resultsBox = blessed.box({
    top: 5,
    left: 'center',
    width: 90,
    height: 1
  })
  const codeBox = blessed.box({
    top: 10,
    left: 'center',
    width: 90,
    height: '60%',
    border: {type: 'line'}
  })
  screen.append(resultsBox)
  screen.append(codeBox)

  a.eachSeries(benchmark.groups, (group, cb) => {
    a.eachSeries(group.tests, (test, cb) => {
      resultsBox.setContent('')
      codeBox.setContent(cardinal.highlight(test.code, {linenos: true}))
      codeBox.once('click', () => cb())
      screen.render()

      setImmediate(() => {
        test.run()
        resultsBox.setContent(test.results.toString())
        screen.render()
      })
    }, cb)
  }, (err) => {
    screen.destroy()
    cb(err)
  })
}
