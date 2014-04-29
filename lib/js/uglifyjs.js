
var minify

module.exports = function (options) {
  options = options || {}
  options = options.uglifyjs || {}
  if (options === true) options = {}

  options.fromString = true
  options.mangle = options.mangle !== false
  if (options.compress == null) options.compress = {}

  return function* transformUglifyJS(next) {
    yield* next

    if (!this.is('js')) return

    var file = this.file

    Object.defineProperties(file, {
      minified: {
        get: function () {
          if (this._minified) return this._minified
          minify = minify || require('uglify-js').minify
          var res = minify(file.string, options)
          return this._minified = res.code
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
