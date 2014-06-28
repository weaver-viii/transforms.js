
var debug = require('debug')('normalize-transforms:react')

var transform

var re = /.+\.jsx\.js$/

module.exports = function (options) {
  options = (options || {}).react
  if (options === true) options = {}
  if (!options) return function* noop(next) { yield* next }

  return function* transformReact(next) {
    if (!re.test(this.basename)) return yield* next

    lazy()

    // not sure how to check whether it's already been processed
    var file = this.setFile()
    debug(file.uri)
    yield* file.setSource(file.uri.replace(/\.js$/, ''))
    file.type = 'js'
    file.string = transform(yield* file.getString(), options)

    yield* next

    if (!file.dependencies) file.dependencies = {}
  }
}

function lazy() {
  if (transform) return transform

  try {
    return transform = require('react-tools').transform
  } catch (err) {
    require('normalize-log').error('react-tools not installed.')
    process.exit(1)
  }
}
