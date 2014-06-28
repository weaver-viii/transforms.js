
var debug = require('debug')('normalize-transforms:sass')

var sass

var re = /.+\.(sass|scss)\.css/

module.exports = function (options) {
  options = (options || {}).sass
  if (options === true) options = {}
  if (!options) return function* noop(next) { yield* next }

  return function* transformSASS(next) {
    if (!re.test(this.basename)) return yield* next

    lazy()

    // not sure how to check whether it's already been processed
    var file = this.setFile()
    debug(file.uri)
    yield* file.setSource(file.uri.match(/^.*\.(sass|scss)/i)[0])
    file.type = 'css'
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

function lazy() {
  if (sass) return sass

  try {
    return sass = require('node-sass')
  } catch (err) {
    require('normalize-log').error('sass not installed.')
    process.exit(1)
  }
}
