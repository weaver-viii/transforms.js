
/**
 * Convert strings to .js exports.
 */

var mime = require('mime-types')
var typeis = require('type-is').is

var re = /\.(\w+)\.js$/i

module.exports = function () {
  return function* walkText(next) {
    var m = re.exec(this.basename)
    if (!m) return yield* next

    var ext = m[1]
    // only support text/* mime types for now
    // note: you need to manually add any custom mime types
    // in the repo https://github.com/expressjs/mime-extended
    if (!typeis(mime.lookup(ext), 'text/*')) return yield* next

    // skip if already js or a different content type already
    var file = this.file
    if (file && file.type && (file.is('js') || !file.is(ext))) return yield* next

    var file = this.setFile()
    yield* file.setSource(file.uri.replace(/\.js$/, ''))
    file.type = ext

    yield* next

    // html could add its own dependencies and such
    if (!file.dependencies) file.dependencies = {}
    if (!file.is(ext)) return

    file.type = 'js'
    file.string = 'export default ' + JSON.stringify(yield* file.getString())
  }
}
