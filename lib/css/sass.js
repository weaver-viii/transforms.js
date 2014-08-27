
var debug = require('debug')('normalize-transforms:sass')

var sass

var re_test = /\.(sass|scss)\.css/
var re_replace = /\.css[^\/]*$/

module.exports = function (options) {
  options = options || {}
  options = options.sass || {}

  return function* transformSASS(next) {
    if (!re_test.test(this.basename)) return yield* next

    lazy()

    // not sure how to check whether it's already been processed
    var file = this.setFile()
    debug(file.uri)
    yield* file.setSource(file.uri.replace(re_replace, ''))
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

module.exports.test = re_test
module.exports.replace = re_replace
