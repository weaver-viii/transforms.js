
var autoprefixer = require('autoprefixer')

module.exports = function (options) {
  options = (options || {}).autoprefixer
  if (options === true) options = {}
  if (!options) return function* noop(next) { yield* next }

  var autoprefix = autoprefixer
  if (options.browsers) autoprefix = autoprefixer(options.browsers)

  return function* transformAutoprefixer(next) {
    yield* next

    if (!this.is('css')) return

    var file = this.file
    if (!file) return
    var string = yield* file.getString()
    file.string = autoprefix.process(string).css
  }
}
