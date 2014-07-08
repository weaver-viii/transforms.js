
var fs = require('fs')
var path = require('path')
var compose = require('composition')
var Walker = require('normalize-walker')

module.exports = transform
var transforms = transform.transforms = {}
var names = transform.names = []
var defaults = transform.options = {
  // default options
  // automatically compile to CommonJS
  cjs: true,
}

fs.readdirSync(__dirname).forEach(function (type) {
  if (type[0] === '.') return
  if (/\.js$/.test(type)) return

  fs.readdirSync(path.join(__dirname, type)).forEach(function (name) {
    if (name[0] === '.') return
    names.push(name = name.replace(/\.js$/, ''))
    defaults[name] = {} // all plugins are enabled by default
    transforms[name] = require('./' + type + '/' + name)
  })
})

function transform(options) {
  options = options || Object.create(transform.options)

  var fns = []
  
  if (options.uglifyjs)
    fns.push(transforms.uglifyjs(options))
  if (options.cleancss)
    fns.push(transforms.cleancss(options))
  if (options.autoprefixer)
    fns.push(transforms.autoprefixer(options))
  if (options.less)
    fns.push(transforms.less(options))
  if (options.sass)
    fns.push(transforms.sass(options))
  if (options.stylus)
    fns.push(transforms.stylus(options))
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
  if (options.coffeescript) // .coffee -> .js
    fns.push(transforms.coffeescript(options))
  fns.push(Walker.plugins.text(options))
  fns.push(Walker.plugins.json(options))
  fns.push(Walker.plugins.css(options))
  if (options.domify) // .html -> .js
    fns.push(transforms.domify(options))
  fns.push(Walker.plugins.js(options))
  fns.push(Walker.plugins.file(options))

  return compose(fns)
}
