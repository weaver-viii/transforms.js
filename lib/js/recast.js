
var debug = require('debug')('normalize-transforms:recast')
var format = require('esprima-error-formatter')
var lazy = require('lazyrequire')(require)
var convert = require('convert-source-map')
var offset = require('offset-source-map')
var Sauce = require('source-map')
var recast = require('recast')

// regenerator is a special case
var regenerator = lazy('regenerator')
var v_regenerator = require('regenerator/package.json').version
var re_generator = /\bfunction *\* *[^\(]* *\([^\)]*\)\s*\{/
var runtime_regenerator_url = 'https://nlz.io/github/facebook/regenerator/' + v_regenerator + '/runtime/dev.js'
var runtime_regenerator = 'import "' + runtime_regenerator_url + '";\n\n'
var runtime_regenerator_cjs = 'require("' + runtime_regenerator + '");\n\n'

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
  var cjs = options.cjs
  options = options.recast

  return function* transformRecast(next) {
    yield* next
    if (!this.is('js')) return

    var file = this.file
    var string = yield* file.getString()
    if (!string) return

    // :(
    var generators = re_generator.test(string)
    var map = convert.fromSource(string)
    if (map) string = convert.removeComments(string)

    // we cache the ast to `this.ast`
    // so we don't ever have to reparse it again
    var ast
    try {
      ast = this.ast = recast.parse(string, {
        sourceFileName: file.basename
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
        sourceMapName: file.basename + '.map'
      })
    } catch (err) {
      console.error(format(err, string, file.uri))
      return
    }

    if (map) {
      var generator = Sauce.SourceMapGenerator.fromSourceMap(new Sauce.SourceMapConsumer(result.map))
      generator.applySourceMap(new Sauce.SourceMapConsumer(map.toObject()))
      map = generator.toString()
    } else {
      map = result.map
    }

    file.string = result.code + convert.fromObject(map).toComment()

    // to do: do this in a less retarded way
    if (generators) {
      var map = offset(file.string, 2)
      file.string = (options.cjs
        ? runtime_regenerator_cjs
        : runtime_regenerator) + map.code + '\n' + map.map.toComment()
    }
  }
}
