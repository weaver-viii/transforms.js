
var marked = require('marked')

var re = /\.(md|markdown)\.html/i

module.exports = function (options) {
  options = (options || {}).markdown
  if (options === true) options = {}
  if (!options) return function* noop(next) { yield* next }

  return function* transformMarkdown(next) {
    if (!re.test(this.basename)) return yield* next

    var file = this.file
    // not sure how to check whether it's already been processed
    if (!file) file = this.file = new this.File(this.uri)
    if (!file.source) yield* file.setSource(file.uri.match(/^.*\.(md|markdown)/i)[0])
    file.type = 'html'
    file.string = yield marked.bind(null, yield* file.getString(), options)

    yield* next

    if (!file.dependencies) file.dependencies = {}
  }
}
