
var regenerator

var re = /\bfunction\s*\*/

module.exports = function (options) {
  options = options || {}
  var cjs = options.cjs

  options = options.regenerator
  if (options === true) options = {}
  if (!options) return function* noop(next) { yield* next }

  var version = options.version || '0'
  var url = 'https://nlz.io/github/facebook/regenerator/' + version + '/runtime/dev.js'
  var runtime = cjs
    ? 'require("' + url + '");\n\n'
    : 'import "' + url + '";\n\n'

  return function* transformRegenerator(next) {
    yield* next

    if (!this.is('js')) return

    var file = this.file
    var string = yield* file.getString()
    if (!re.test(string)) return

    regenerator = regenerator || require('regenerator')
    file.string = runtime + regenerator(string, options)
  }
}
