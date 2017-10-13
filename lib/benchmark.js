
const {Suite} = require('benchmark')

class Group {
  constructor(name) {
    this.name = name
    this.tests = []
  }

  addTest(test) {
    this.tests.push(test)
  }
}

class Test {
  constructor(name, test) {
    this.name = name
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
