
var debug = require('debug')('normalize-transforms:stylus')

var stylus

var re_test = /\.(styl|stylus)\.css/
var re_replace = /\.css[^\/]*/

module.exports = function (options) {
  options = options || {}
  options = options.stylus || {}

  return function* transformStylus(next) {
    if (!re_test.test(this.basename)) return yield* next

    lazy()

    // not sure how to check whether it's already been processed
    var file = this.setFile()
    debug(file.uri)
    yield* file.setSource(file.uri.replace(re_replace, ''))
    file.type = 'css'
    var styluscss = yield* file.getString()
    file.string = yield function (done) {
      stylus.render(styluscss, {
        filename: file.source
      }, done)
    }

    yield* next
  }
}

function lazy() {
  if (stylus) return stylus

  try {
    return stylus = require('stylus')
  } catch (err) {
    require('normalize-log').error('stylus not installed.')
    process.exit(1)
  }
}

module.exports.test = re_test
module.exports.replace = re_replace
