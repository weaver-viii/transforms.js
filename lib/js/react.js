
var transform

var re = /\.jsx\.js$/

module.exports = function (options) {
  options = (options || {}).markdown
  if (options === true) options = {}
  if (!options) return function* noop(next) { yield* next }

  return function* transformMarkdown(next) {
    if (!re.test(this.basename)) return yield* next

    // not sure how to check whether it's already been processed
    var file = this.setFile()
    yield* file.setSource(file.uri.replace(/\.js$/, ''))
    file.type = 'js'
    transform = transform || require('react-tools').transform
    file.string = transform(yield* file.getString(), options)

    yield* next

    if (!file.dependencies) file.dependencies = {}
  }
}
