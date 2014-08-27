
/**
 * Convert strings to .js exports.
 */

var mime = require('mime-types')
var typeis = require('type-is').is

var re_test = /\.(\w+)\.js$/i
var re_replace = /\.js$/

module.exports = function () {
  return function* transformText(next) {
    var ext = test(this.basename)
    if (!ext) return yield* next

    // skip if already js or a different content type already
    var file = this.file
    if (file && file.type && (file.is('js') || !file.is(ext))) return yield* next

    var file = this.setFile()
    yield* file.setSource(file.uri.replace(re_replace, ''))
    file.type = ext

    yield* next

    // html could add its own dependencies and such
    if (!file.dependencies) file.dependencies = {}
    if (!file.is(ext)) return

    file.type = 'js'
    file.string = 'export default ' + JSON.stringify(yield* file.getString())
  }
}

function test(basename) {
  var m = re_test.exec(basename)
  if (!m) return false

  var ext = m[1]
  if (typeis(mime.lookup(ext), 'text/*')) return ext
}

module.exports.test = test
module.exports.replace = re_replace
