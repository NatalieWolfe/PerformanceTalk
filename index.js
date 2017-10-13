
const a = require('async')
const blessed = require('blessed')
const cardinal = require('cardinal')
const fs = require('fs')
const path = require('path')

const benchmark = require('./lib/benchmark')


const groups = [
  'wrapping'
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
    benchmark.startGroup(group)

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
  const root = blessed.element({
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  })
  screen.append(root)

  const groupTitle = blessed.bigtext({
    top: 0,
    left: 'center',
    fch: '#'
  })
  const testTitle = blessed.box({
    top: 15,
    left: 'center',
    width: 90,
    height: 1,
    style: {fg: 'bright-blue', bold: true}
  })
  const resultsBox = blessed.box({
    top: 16,
    left: 'center',
    width: 90,
    height: 1,
    tags: true
  })
  const codeBox = blessed.box({
    top: 18,
    left: 'center',
    width: 90,
    height: '60%',
    border: {type: 'line'}
  })

  root.append(groupTitle)
  root.append(testTitle)
  root.append(codeBox)
  root.append(resultsBox)

  a.eachSeries(benchmark.groups, (group, cb) => {
    groupTitle.setText(group.name)
    let previousHz = 0
    let firstHz = 0

    a.eachSeries(group.tests, (test, cb) => {
      testTitle.setContent(test.name)
      resultsBox.setContent('')

      codeBox.height = test.code.split('\n').length + 2

      codeBox.setContent(cardinal.highlight(test.code, {linenos: true}))
      root.once('click', () => cb())
      screen.render()

      setImmediate(() => {
        // resultsBox.setContent('done')
        test.run()

        // Format these results
        const hz = Math.round(test.results.hz)
        const confidence = test.results.stats.rme.toFixed(2)
        let results = `{bold}${hz.toLocaleString()}{/bold} hz ±${confidence}%`

        if (previousHz) {
          const diff = hz / previousHz * 100
          const diffColor = diff < 100 ? 'red-bg' : 'green-bg'
          results += ` -> {${diffColor}}{black-fg}${diff.toFixed(2)}%{/black-fg}{/${diffColor}}`
        }

        if (firstHz !== previousHz) {
          const diff = hz / firstHz * 100
          const diffColor = diff < 100 ? 'red-bg' : 'green-bg'
          results += ` -> {${diffColor}}{black-fg}${diff.toFixed(2)}%{/black-fg}{/${diffColor}}`
        } else if (firstHz === 0) {
          firstHz = hz
        }

        resultsBox.setContent(`{center}${results}{/center}`)
        screen.render()

        previousHz = hz
      })
    }, cb)
  }, (err) => {
    screen.destroy()
    cb(err)
  })
}
