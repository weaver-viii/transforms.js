
var coffee

var re = /.+\.coffee\.js$/

module.exports = function (options) {
  options = (options || {}).coffeescript
  if (options === true) options = {}
  if (!options) return function* noop(next) { yield* next }

  return function* transformCoffeeScript(next) {
    if (!re.test(this.basename)) return yield* next

    // not sure how to check whether it's already been processed
    var file = this.setFile()
    yield* file.setSource(file.uri.replace(/\.js$/, ''))
    file.type = 'js'
    coffee = coffee || require('coffee-script')
    var code = coffee.compile(yield* file.getString(), {
      bare: true,
      filename: file.source,
      sourceMap: true,
    })
    file.string = code.js

    yield* next
  }
}
