
var debug = require('debug')('normalize-transforms:sass')

var sass

var re = /.+\.(sass|scss)\.css/

module.exports = function (options) {
  options = (options || {}).sass
  if (options === true) options = {}
  if (!options) return function* noop(next) { yield* next }

  return function* transformSASS(next) {
    if (!re.test(this.basename)) return yield* next

    // not sure how to check whether it's already been processed
    var file = this.setFile()
    debug(file.uri)
    yield* file.setSource(file.uri.match(/^.*\.(sass|scss)/i)[0])
    file.type = 'css'
    sass = sass || require('node-sass')
    var sasscss = yield* file.getString()
    file.string = yield function (done) {
      sass.render({
        data: sasscss,
        file: file.source,
        success: function (css) {
          done(null, css)
        },
        error: done,
      })
    }

    yield* next
  }
}
