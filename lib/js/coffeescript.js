
var debug = require('debug')('normalize-transforms:coffee')

var coffee

var re_test = /\.(coffee|litcoffee)\.js$/
var re_replace = /\.js$/

module.exports = function (options) {
  options = options || {}
  options = options.coffeescript || {}

  return function* transformCoffeeScript(next) {
    if (!re_test.test(this.basename)) return yield* next

    lazy()

    // not sure how to check whether it's already been processed
    var file = this.setFile()
    debug(file.uri)
    yield* file.setSource(file.uri.replace(re_replace, ''))
    file.type = 'js'
    var string = yield* file.getString()
    var code = coffee.compile(string, {
      bare: true,
      filename: file.source,
      sourceMap: true,
    })
    file.string = code.js
    file.map = code.v3SourceMap

    yield* next
  }
}

function lazy() {
  if (coffee) return coffee

  try {
    return coffee = require('coffee-script')
  } catch (err) {
    require('normalize-log').error('coffee not installed.')
    process.exit(1)
  }
}

module.exports.test = re_test
module.exports.replace = re_replace
