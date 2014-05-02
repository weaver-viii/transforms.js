
var fs = require('fs')
var path = require('path')
var compose = require('composition')
var Walker = require('normalize-walker')

module.exports = transform
var transforms = transform.transforms = {}
var names = transform.names = []
var defaults = transform.options = {
  cjs: true,
}

// lazily define all the plugins
fs.readdirSync(__dirname).filter(function (name) {
  if (name[0] === '.') return
  if (/\.js$/.test(name)) return
  return name
}).forEach(function (type) {
  fs.readdirSync(path.join(__dirname, type)).forEach(function (name) {
    if (name[0] === '.') return
    names.push(name = name.replace(/\.js$/, ''))
    defaults[name] = true
    Object.defineProperty(transforms, name, {
      get: function () {
        var memo = '__' + name
        if (this[memo]) return this[memo]
        return this[memo] = require('./' + type + '/' + name)
      }
    })
  })
})

function transform(options) {
  var fns = []

  options = options || Object.create(transform.options)
  // commonjs by default for now
  options.cjs = options.cjs !== false

  if (options.uglifyjs)
    fns.push(transforms.uglifyjs(options))
  if (options.cleancss)
    fns.push(transforms.cleancss(options))
  if (options.autoprefixer)
    fns.push(transforms.autoprefixer(options))
  if (options.rework)
    fns.push(transforms.rework(options))
  if (options.regenerator)
    fns.push(transforms.regenerator(options))
  if (options.cjs)
    fns.push(transforms.modules(options))
  if (options.jade) // .jade -> .js, .jade -> .html
    fns.push(transforms.jade(options))
  if (options.markdown) // .md|markdown -> .html
    fns.push(transforms.markdown(options))
  if (options.react) // .jsx -> .js
    fns.push(transforms.react(options))
  fns.push(Walker.plugins.text(options))
  fns.push(Walker.plugins.json(options))
  fns.push(Walker.plugins.css(options))
  if (options.domify) // .html -> .js
    fns.push(transforms.domify(options))
  fns.push(Walker.plugins.js(options))
  fns.push(Walker.plugins.file(options))

  return compose(fns)
}
