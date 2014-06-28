
var debug = require('debug')('normalize-transforms:less')

var less

var re = /.+\.less\.css/

module.exports = function (options) {
  options = (options || {}).less
  if (options === true) options = {}
  if (!options) return function* noop(next) { yield* next }

  return function* transformLESS(next) {
    if (!re.test(this.basename)) return yield* next

    lazy()

    // not sure how to check whether it's already been processed
    var file = this.setFile()
    debug(file.uri)
    yield* file.setSource(file.uri.match(/^.*\.less/i)[0])
    file.type = 'css'
    var lesscss = yield* file.getString()
    file.string = yield function (done) {
      less.render(lesscss, {
        filename: file.source
      }, done)
    }

    yield* next
  }
}

function lazy() {
  if (less) return less

  try {
    return less = require('less')
  } catch (err) {
    require('normalize-log').error('less.js not installed.')
    process.exit(1)
  }
}
