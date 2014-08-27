
/**
 * To do: check for syntax errors
 */

var re_test = /json\.js$/
var re_replace = /\.js$/

module.exports = function () {
  return function* transformJSON(next) {
    if (!re_test.test(this.basename)) return yield* next

    var file = this.file
    // already converted to js
    if (file && file.is('js')) return yield* next

    file = this.setFile()
    yield* file.setSource(file.uri.replace(re_replace, ''))
    var string = yield* file.getString()
    file.dependencies = {}
    file.string = 'export default ' + string
  }
}

module.exports.test = re_test
module.exports.replace = re_replace
