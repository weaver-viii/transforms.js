
module.exports = function (options) {
  options = options || {}
  var verbose = options.verbose
  options = options.rework || {}
  if (!options) return function* noop(next) { yield* next }

  var Rework = require('rework')

  // plugins are opt-out
  var plugins = []
  if (options.hex !== false) plugins.push(require('rework-hex-alpha'))
  if (options.color !== false) plugins.push(require('rework-color-function'))
  if (options.calc !== false) plugins.push(require('rework-calc'))
  if (options.variants !== false) plugins.push(require('rework-font-variant'))

  // to do: custom rework functions

  return function* transformRework(next) {
    yield* next

    if (!this.is('css')) return

    var file = this.file
    var string = yield* file.getString()

    try {
      var rework = Rework(string)
      plugins.forEach(function (plugin) {
        rework.use(plugin)
      })
      string = rework.toString()
    } catch (err) {
      console.error('error reworking ' + (file.remote || file.uri))
      if (verbose) console.error(err.stack)
      return
    }

    file.string = string
  }
}
