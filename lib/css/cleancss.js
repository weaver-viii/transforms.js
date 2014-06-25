
var CleanCSS

module.exports = function (options) {
  options = options || {}
  options = options.cleancss || {}
  if (options === true) options = {}

  if (options.keepSpecialComments == null)
    options.keepSpecialComments = 0
  options.noRebase = options.noRebase !== false
  options.processImport = false

  var clean

  return function* transformCleanCSS(next) {
    yield* next

    if (!this.is('css')) return

    var file = this.file

    Object.defineProperties(file, {
      minified: {
        get: function () {
          if (this._minified) return this._minified
          if (!clean) {
            if (!CleanCSS) CleanCSS = require('clean-css')
            clean = new CleanCSS(options)
          }
          return this._minified = clean.minify(file.string)
        }
      },
      minifiedLength: {
        get: function () {
          if (this._minifiedLength) return this._minifiedLength
          return this._minifiedLength = Buffer.byteLength(this.minified)
        }
      }
    })
  }
}
