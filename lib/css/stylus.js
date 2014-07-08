
var debug = require('debug')('normalize-transforms:stylus')

var stylus

var re = /.+\.(styl|stylus)\.css/

module.exports = function (options) {
  options = options || {}
  options = options.stylus || {}

  return function* transformStylus(next) {
    if (!re.test(this.basename)) return yield* next

    lazy()

    // not sure how to check whether it's already been processed
    var file = this.setFile()
    debug(file.uri)
    yield* file.setSource(file.uri.match(/^.*\.(styl|stylus)/i)[0])
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
