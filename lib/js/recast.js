
var debug = require('debug')('normalize-transforms:recast')
var lazy = require('lazyrequire')(require)
var format = require('esprima-error-formatter')
var recast = require('recast')

// regenerator is a special case
var regenerator = lazy('regenerator')
var v_regenerator = require('regenerator/package.json').version
var re_generator = /\bfunction *\* *[^\(]* *\([^\)]*\)\s*\{/
var runtime_regenerator_url = 'https://nlz.io/github/facebook/regenerator/' + v_regenerator + '/runtime/dev.js'
var runtime_regenerator = 'import "' + runtime_regenerator_url + '";\n\n'

// all the other transforms
var transforms = [
  lazy('es6-arrow-function'),
  lazy('es6-class'),
  lazy('es6-templates'),
  lazy('es6-default-params'),
  lazy('es6-spread'),
  lazy('es6-rest-params'),
  lazy('es6-comprehensions'),
]

module.exports = function (options) {
  options = options || {}
  // var cjs = options.cjs
  options = options.recast

  return function* transformRecast(next) {
    yield* next
    if (!this.is('js')) return

    var file = this.file
    var string = yield* file.getString()

    // :(
    var generators = re_generator.test(string)
    if (generators) string = runtime_regenerator + string

    // we cache the ast to `this.ast`
    // so we don't ever have to reparse it again
    var ast
    try {
      ast = this.ast = recast.parse(string, {
        sourceFileName: file.uri
      })
    } catch (err) {
      console.error(format(err, string, file.uri))
      return
    }


    transforms.forEach(function (transform) {
      ast = transform().transform(ast)
    })

    if (generators) {
      ast = regenerator().transform(ast)
      file.push(runtime_regenerator_url)
    }

    var result
    try {
      result = recast.print(ast, {
        sourceMapName: 'map.json'
      })
    } catch (err) {
      console.error(format(err, string, file.uri))
      return
    }

    file.string = result.code
  }
}
