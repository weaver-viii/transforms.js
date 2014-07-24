
var uglify = require('lazyrequire')(require)('uglify-js')
var utils = require('../utils')

module.exports = function (options) {
  options = options || {}
  options = options.uglifyjs || {}

  options.fromString = true
  options.mangle = options.mangle !== false
  if (options.compress == null) options.compress = {}

  var properties = {
    minified: {
      get: function () {
        if (this._minified) return this._minified.code
        var res = this._minified = uglify().minify(this.string, {
          fromString: true,
          mangle: options.mangle !== false,
          compress: options.compress || {},
          outSourceMap: this.uri.replace(/\.js$/, '') + '.min.js.map',
        })
        res.code = utils.removeSourceMap(res.code)
        return res.code
      }
    },
    minifiedLength: {
      get: function () {
        if (this._minifiedLength) return this._minifiedLength
        return this._minifiedLength = Buffer.byteLength(this.minified)
      }
    },
    minifiedMap: {
      get: function () {
        if (!this._minified) this.minified
        return this._minified.map
      }
    }
  }

  return function* transformUglifyJS(next) {
    yield* next
    if (!this.is('js')) return

    Object.defineProperties(this.file, properties)
  }
}
