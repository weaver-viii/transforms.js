
/**
 * To do: check for syntax errors
 */

var re = /json\.js$/i

module.exports = function () {
  return function* walkJSON(next) {
    if (!re.test(this.basename)) return yield* next

    var file = this.file
    // already converted to js
    if (file && file.is('js')) return yield* next

    file = this.setFile()
    yield* file.setSource(file.uri.replace(/\.js$/, ''))
    var string = yield* file.getString()
    file.dependencies = {}
    file.string = 'export default ' + string
  }
}
