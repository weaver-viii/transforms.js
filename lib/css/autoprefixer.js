
var debug = require('debug')('normalize-transforms:autoprefixer')

module.exports = function (options) {
  options = options || {}
  options = options.autoprefixer || {}

  var autoprefix

  return function* transformAutoprefixer(next) {
    yield* next

    if (!this.is('css')) return

    var file = this.file
    debug(file.uri)
    var string = yield* file.getString()
    if (!autoprefix) lazy()
    var result
    try {
      result = autoprefix.process(string, {
        map: {
          inline: true
        },
      })
    } catch (err) {
      // need to format this shit correctly
      throw err
    }
    file.string = result.css
  }

  function lazy() {
    /* jshint ignore:start */
    var autoprefixer = autoprefix = require('autoprefixer')
    if (options.browsers) autoprefix = autoprefixer(options.browsers)
    /* jshint ignore:end */
  }
}
