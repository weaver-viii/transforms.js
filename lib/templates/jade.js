
var jade

// can't figure out a way to combine these
var reHTML = /.+\.jade\.html/
var reJS = /.+\.jade(\.\w+)*\.js$/

module.exports = function (options) {
  options = options || {}
  var cjs = options.cjs

  options = options.jade
  if (options === true) options = {}
  if (!options) return function* noop(next) { yield* next }

  var version = options.version || '1'
  var url = 'https://nlz.io/github/visionmedia/jade/' + version + '/lib/runtime.js'
  var runtime = cjs
    ? 'var jade = require("' + url + '");\n'
    : 'module jade from "' + url + '";\n'
  var loader = cjs
    ? 'module.exports = '
    : 'export default '

  return function* transformJade(next) {
    var html = reHTML.test(this.basename)
    var js = reJS.test(this.basename)
    if (!html && !js) return yield* next

    var file = this.setFile()
    yield* file.setSource(file.uri.match(/^.*\.jade/)[0])
    file.type = 'jade'

    var src = yield* file.getString()

    jade = jade || require('jade')

    if (html) {
      file.string = jade.render(src, {
        filename: file.source
      })
      file.type = 'html'
    } else if (js) {
      file.string = runtime
        + loader
        + jade.compileClient(src, {
            filename: file.source
          })
      file.type = 'js'
    }

    yield* next

    if (!html && js) file.push(url)
    else if (!file.dependencies) file.dependencies = {}
  }
}
