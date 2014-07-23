
var debug = require('debug')('normalize-transforms:jstransform')
var format = require('esprima-error-formatter')
var lazy = require('lazyrequire')(require)
var isModule = require('is-module')
var jstransform = lazy('jstransform')
var moduleTransform = lazy('es6-module-jstransform')

module.exports = function (options) {
  options = options || {}
  var cjs = options.cjs
  options = options.jstransform

  return function* transformJS(next) {
    yield* next
    if (!this.is('js')) return

    var file = this.file
    var string = yield* file.getString()

    if (!(cjs && isModule(string))) return

    var out
    try {
      out = jstransform().transform(moduleTransform().visitorList, string, {
        filename: file.uri,
        sourceMap: true
      })
    } catch (err) {
      console.error(format(err, string, file.uri))
      return
    }

    file.string = out.code
  }
}
