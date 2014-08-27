
var debug = require('debug')('normalize-transforms:domify')

var re_test = /\.html\.domify\.js$/
var re_replace = /\.domify\.js$/

module.exports = function (options) {
  options = options || {}
  options = options.domify || {}

  var url = 'https://nlz.io/github/component/domify/' + (options.version || '1') + '/index.js'
  var prefix = '\n'
    + 'import domify from "' + url + '";\n\n'
    + 'export default '

  return function* transformDomify(next) {
    if (!re_test.test(this.basename)) return yield* next

    var file = this.file
    // already transformed
    if (file && file.type && (file.is('js') || !file.is('html'))) return yield* next
    file = this.setFile()
    debug(file.uri)
    yield* file.setSource(file.uri.replace(re_replace, ''))

    var string = yield* file.getString()

    file.type = 'js'
    file.string = prefix + 'domify(' + JSON.stringify(string) + ');\n'

    yield* next

    file.push(url)
  }
}

module.exports.test = re_test
module.exports.replace = re_replace
