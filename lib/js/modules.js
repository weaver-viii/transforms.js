
var debug = require('debug')('normalize-transforms:modules')
var isModule = require('is-module')
var transpile

module.exports = function (options) {
  options = options || {}
  if (!options.cjs) return function* noop(next) { yield* next }

  return function* transformModule(next) {
    yield* next

    if (!this.is('js')) return

    var file = this.file
    var string = yield* file.getString()
    if (!isModule(string)) return
    debug(file.uri)

    transpile = transpile || require('es6-module-jstransform')
    file.string = transpile(string).code
  }
}
