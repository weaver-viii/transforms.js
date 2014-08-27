
var debug = require('debug')('normalize-transforms:markdown')

var marked

var re_test = /\.(md|markdown)\.html/i
var re_replace = /\.html[^\/]*/

module.exports = function (options) {
  options = options || {}
  options = options.markdown || {}

  return function* transformMarkdown(next) {
    if (!re_test.test(this.basename)) return yield* next

    lazy()

    // not sure how to check whether it's already been processed
    var file = this.setFile()
    debug(file.uri)
    yield* file.setSource(file.uri.replace(re_replace, ''))
    var string = yield* file.getString()
    file.type = 'html'
    file.string = yield marked.bind(null, string, options)

    yield* next

    if (!file.dependencies) file.dependencies = {}
  }
}

module.exports.test = re_test
module.exports.replace = re_replace

function lazy() {
  if (marked) return marked

  try {
    return marked = require('marked')
  } catch (err) {
    require('normalize-log').error('marked not installed.')
    process.exit(1)
  }
}
