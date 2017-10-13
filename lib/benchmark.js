
const {Suite} = require('benchmark')

function titleCase(str) {
  return str.replace(
    /\b([^\w]*\w)/g,
    (m) => ((m.length > 1 ? ' ' : '') + m[m.length - 1].toUpperCase())
  )
}

class Group {
  constructor(name) {
    this.name = titleCase(name)
    this.tests = []
  }

  addTest(test) {
    this.tests.push(test)
  }
}

class Test {
  constructor(name, test) {
    this.name = titleCase(name)
    this.code = test.toString()
    this.results = null
    this.test = new Suite()
    this.test.add(name, test)
    this.test.on('cycle', (evnt) => this.results = evnt.target)
  }

  run() {
    this.test.run()
  }
}

const groups = []

module.exports = exports = function(name, fn) {
  const test = new Test(name, fn)
  groups[groups.length - 1].addTest(test)
}

exports.startGroup = function(name) {
  groups.push(new Group(name))
}

exports.groups = groups
