
var debug = require('debug')('normalize-transforms:less')

var less

var re_test = /\.less\.css/
var re_replace = /\.css[^\/]*/

module.exports = function (options) {
  options = options || {}
  options = options.less || {}

  return function* transformLESS(next) {
    if (!re_test.test(this.basename)) return yield* next

    lazy()

    // not sure how to check whether it's already been processed
    var file = this.setFile()
    debug(file.uri)
    yield* file.setSource(file.uri.replace(re_replace, ''))
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

module.exports.test = re_test
module.exports.replace = re_replace
