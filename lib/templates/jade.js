
var debug = require('debug')('normalize-transforms:jade')

var jade
var version
var url

var re_test = /\.jade\.(html|js$)/
var re_replace = /\.(html|js)[^\/]*$/

module.exports = function () {
  var runtime

  return function* transformJade(next) {
    var m = re_test.exec(this.basename)
    if (!m) return yield* next
    var js = m[1] === 'js'

    lazy()

    var file = this.setFile()
    debug(file.uri)
    yield* file.setSource(file.uri.replace(re_replace, ''))
    file.type = 'jade'

    var src = yield* file.getString()

    if (js) {
      file.string = runtime
        + 'export default '
        + jade.compileClient(src, {
            filename: file.source
          })
      file.type = 'js'
    } else {
      file.string = jade.render(src, {
        filename: file.source
      })
      file.type = 'html'
    }

    yield* next

    if (js) file.push(url)
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
    runtime = runtime || ('import jade from "' + url + '";\n\n')
  }
}

module.exports.test = re_test
module.exports.replace = re_replace
