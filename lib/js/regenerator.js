
var debug = require('debug')('normalize-transforms:regenerator')

var regenerator
var version
var url

var re = /\bfunction *\* *[^\(]* *\([^\)]*\)\s*\{/

module.exports = function (options) {
  options = options || {}
  var cjs = options.cjs
  options = options.regenerator || {}

  var runtime

  return function* transformRegenerator(next) {
    yield* next

    if (!this.is('js')) return

    lazy()

    var file = this.file
    debug(file.uri)
    var string = yield* file.getString()
    if (!re.test(string)) return

    file.string = runtime + regenerator(string, options)
    file.push(url)
  }

  function lazy() {
    try {
      regenerator = regenerator || require('regenerator')
    } catch (err) {
      require('normalize-log').error('regenerator not installed.')
      process.exit(1)
    }

    version = version || require('regenerator/package.json').version
    url = url ||
      ('https://nlz.io/github/facebook/regenerator/' + version + '/runtime/dev.js')
    runtime = runtime || (cjs
      ? 'require("' + url + '");\n\n'
      : 'import "' + url + '";\n\n')
  }
}
