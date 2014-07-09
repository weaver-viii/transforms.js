
var debug = require('debug')('normalize-transforms:jstransform')
var isModule = require('is-module')

var transform
var transformModules

// these are all the bundled jstransforms
// to do: test for each feature before using the transform
var visitorsBundled = [
  'es6-arrow-function',
  'es6-class',
  'es6-destructuring',
  'es6-object-concise-method',
  'es6-object-short-notation',
  'es6-rest-param',
  'es6-template',
  'es7-spread-property',
].map(function (name) {
  return require('jstransform/visitors/' + name + '-visitors').visitorList
}).reduce(function (a, b) {
  return a.concat(b)
}, [])

module.exports = function (options) {
  options = options || {}
  var cjs = options.cjs
  options = options.jstransform

  var _visitors = visitorsBundled
  if (!options) _visitors = []

  return function* transformJS(next) {
    yield* next
    if (!this.is('js')) return

    var file = this.file
    var string = yield* file.getString()

    var visitors = _visitors
    if (cjs && isModule(string)) {
      transformModules = transformModules || require('es6-module-jstransform/visitors').visitorList
      visitors = visitors.concat(transformModules)
    }
    if (!visitors.length) return
    debug(file.uri)

    transform = transform || require('jstransform').transform
    var out = transform(visitors, string, {
      sourceMap: true
    })

    file.string = out.code
  }
}
