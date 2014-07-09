
var debug = require('debug')('normalize-transforms:jade')

var jade
var version
var url

// can't figure out a way to combine these
var reHTML = /.+\.jade\.html/
var reJS = /.+\.jade(\.\w+)*\.js$/

module.exports = function () {
  var runtime

  return function* transformJade(next) {
    var html = reHTML.test(this.basename)
    var js = reJS.test(this.basename)
    if (!html && !js) return yield* next

    lazy()

    var file = this.setFile()
    debug(file.uri)
    yield* file.setSource(file.uri.match(/^.*\.jade/)[0])
    file.type = 'jade'

    var src = yield* file.getString()

    if (html) {
      file.string = jade.render(src, {
        filename: file.source
      })
      file.type = 'html'
    } else if (js) {
      file.string = runtime
        + 'export default '
        + jade.compileClient(src, {
            filename: file.source
          })
      file.type = 'js'
    }

    yield* next

    if (!html && js) file.push(url)
    else if (!file.dependencies) file.dependencies = {}
  }

  function lazy() {
    try {
      jade = jade || require('jade')
    } catch (err) {
      require('normalize-log').error('jade not installed.')
      process.exit(1)
    }

    version = version || require('jade/package.json').version
    url = url || ('https://nlz.io/github/visionmedia/jade/' + version + '/lib/runtime.js')
    runtime = runtime || ('var jade = require("' + url + '");\n\n')
  }
}
