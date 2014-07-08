
var debug = require('debug')('normalize-transforms:domify')

var re = /.+\.html\.domify\.js$/

module.exports = function (options) {
  options = options || {}
  var cjs = options.cjs
  options = options.domify || {}

  var version = options.version || '1'
  var url = 'https://nlz.io/github/component/domify/' + version + '/index.js'
  var domify = cjs
    ? 'var domify = require("' + url + '");\n\n'
    : 'module domify from "' + url + '";\n\n'
  var loader = cjs
    ? 'module.exports = '
    : 'export default '

  return function* transformDomify(next) {
    if (!re.test(this.basename)) return yield* next

    var file = this.file
    // already transformed
    if (file && file.type && (file.is('js') || !file.is('html'))) return yield* next
    file = this.setFile()
    debug(file.uri)
    yield* file.setSource(file.uri.match(/^.*\.html/)[0])

    var string = yield* file.getString()

    file.type = 'js'
    file.string = domify
      + loader
      + 'domify(' + JSON.stringify(string) + ');\n'

    yield* next

    file.push(url)
  }
}
