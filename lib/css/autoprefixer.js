
module.exports = function (options) {
  options = (options || {}).autoprefixer
  if (options === true) options = {}
  if (!options) return function* noop(next) { yield* next }

  var autoprefix

  return function* transformAutoprefixer(next) {
    yield* next

    if (!this.is('css')) return

    var file = this.file
    var string = yield* file.getString()
    if (!autoprefix) lazy()
    file.string = autoprefix.process(string).css
  }

  function lazy() {
    /* jshint ignore:start */
    var autoprefixer = autoprefix = require('autoprefixer')
    if (options.browsers) autoprefix = autoprefixer(options.browsers)
    /* jshint ignore:end */
  }
}
