
/**
 * Always comment out shebangs because they have no use in frontend development.
 */

var deshebang = require('comment-shebang')

module.exports = function* transformShebang(next) {
  yield* next
  if (!this.is('js')) return

  var file = this.file
  var string = yield* file.getString()
  file.string = deshebang(string)
}
