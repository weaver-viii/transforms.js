
var less

var re = /.+\.less\.css/

module.exports = function (options) {
  options = (options || {}).less
  if (options === true) options = {}
  if (!options) return function* noop(next) { yield* next }

  return function* transformLESS(next) {
    if (!re.test(this.basename)) return yield* next

    // not sure how to check whether it's already been processed
    var file = this.setFile()
    yield* file.setSource(file.uri.match(/^.*\.less/i)[0])
    file.type = 'css'
    less = less || require('less')
    var lesscss = yield* file.getString()
    file.string = yield function (done) {
      less.render(lesscss, {
        filename: file.source
      }, done)
    }

    yield* next
  }
}
