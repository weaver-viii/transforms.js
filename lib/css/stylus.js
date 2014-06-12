
var debug = require('debug')('normalize-transforms:stylus')

var stylus

var re = /.+\.(styl|stylus)\.css/

module.exports = function (options) {
  options = (options || {}).stylus
  if (options === true) options = {}
  if (!options) return function* noop(next) { yield* next }

  return function* transformStylus(next) {
    if (!re.test(this.basename)) return yield* next

    // not sure how to check whether it's already been processed
    var file = this.setFile()
    debug(file.uri)
    yield* file.setSource(file.uri.match(/^.*\.(styl|stylus)/i)[0])
    file.type = 'css'
    stylus = stylus || require('stylus')
    var styluscss = yield* file.getString()
    file.string = yield function (done) {
      stylus.render(styluscss, {
        filename: file.source
      }, done)
    }

    yield* next
  }
}
