
var debug = require('debug')('normalize-transforms:regenerator')

var regenerator
var runtime
var version
var url

var re = /\bfunction *\* *[^\(]* *\([^\)]*\)\s*\{/

module.exports = function (options) {
  options = options || {}
  options = options.regenerator || {} // not sure what the options are

  return function* transformRegenerator(next) {
    yield* next

    if (!this.is('js')) return

    var file = this.file
    debug(file.uri)
    var string = yield* file.getString()
    if (!re.test(string)) return

    lazy()

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
    url = url || ('https://nlz.io/github/facebook/regenerator/' + version + '/runtime/dev.js')
    runtime = runtime || ('import "' + url + '";\n\n')
  }
}
