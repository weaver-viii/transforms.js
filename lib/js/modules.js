
var isModule = require('is-module')
var transpile = require('es6-module-jstransform')

module.exports = function (options) {
  options = options || {}
  if (!options.cjs) return function* noop(next) { yield* next }

  return function* transformModule(next) {
    yield* next

    if (!this.is('js')) return

    var file = this.file
    var string = yield* file.getString()
    if (!isModule(string)) return

    file.string = transpile(string).code
  }
}
