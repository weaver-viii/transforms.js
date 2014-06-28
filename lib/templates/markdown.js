
var debug = require('debug')('normalize-transforms:markdown')

var marked

var re = /.+\.(md|markdown)\.html/i

module.exports = function (options) {
  options = (options || {}).markdown
  if (options === true) options = {}
  if (!options) return function* noop(next) { yield* next }

  return function* transformMarkdown(next) {
    if (!re.test(this.basename)) return yield* next

    lazy()

    // not sure how to check whether it's already been processed
    var file = this.setFile()
    debug(file.uri)
    yield* file.setSource(file.uri.match(/^.*\.(md|markdown)/i)[0])
    file.type = 'html'
    file.string = yield marked.bind(null, yield* file.getString(), options)

    yield* next

    if (!file.dependencies) file.dependencies = {}
  }
}

function lazy() {
  if (marked) return marked

  try {
    return marked = require('marked')
  } catch (err) {
    require('normalize-log').error('marked not installed.')
    process.exit(1)
  }
}
