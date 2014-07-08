
var debug = require('debug')('normalize-transforms:coffee')

var coffee

var re = /.+\.coffee\.js$/

module.exports = function (options) {
  options = options || {}
  options = options.coffeescript || {}

  return function* transformCoffeeScript(next) {
    if (!re.test(this.basename)) return yield* next

    lazy()

    // not sure how to check whether it's already been processed
    var file = this.setFile()
    debug(file.uri)
    yield* file.setSource(file.uri.replace(/\.js$/, ''))
    file.type = 'js'
    var code = coffee.compile(yield* file.getString(), {
      bare: true,
      filename: file.source,
      sourceMap: true,
    })
    file.string = code.js

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
