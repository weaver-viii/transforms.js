
var marked

var re = /\.(md|markdown)\.html/i

module.exports = function (options) {
  options = (options || {}).markdown
  if (options === true) options = {}
  if (!options) return function* noop(next) { yield* next }

  return function* transformMarkdown(next) {
    if (!re.test(this.basename)) return yield* next

    // not sure how to check whether it's already been processed
    var file = this.setFile()
    yield* file.setSource(file.uri.match(/^.*\.(md|markdown)/i)[0])
    file.type = 'html'
    marked = marked || require('marked')
    file.string = yield marked.bind(null, yield* file.getString(), options)

    yield* next

    if (!file.dependencies) file.dependencies = {}
  }
}
