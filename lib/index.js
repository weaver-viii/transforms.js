
var fs = require('fs')
var path = require('path')
var compose = require('composition')
var plugins = require('deps-walk').plugins

module.exports = transform
var transforms = transform.transforms = []

fs.readdirSync(__dirname).forEach(function (type) {
  if (type[0] === '.') return
  if (/\.js$/.test(type)) return
  fs.readdirSync(path.join(__dirname, type)).forEach(function (name) {
    if (name[0] === '.') return
    name = name.replace(/\.js$/, '')
    transforms.push(transform[name] = require('./' + type + '/' + name))
  })
})

function transform(options) {
  return compose([
    transform.less(options),
    transform.sass(options),
    transform.stylus(options),
    transform.jade(options),
    transform.markdown(options),
    transform.react(options),
    transform.coffeescript(options),
    transform.json(options),
    // before .js so that they can be required via js
    plugins.css(options),
    plugins.html(options),
    transform.text(options), // after css for .css.js
    transform.domify(options), // after text for .html.js
    plugins.js(options),
    plugins.file(options),
  ])
}

transform.map = function (uri) {
  var prev
  while (uri !== prev) uri = _map(prev = uri)
  return uri
}

function _map(uri) {
  for (var i = 0; i < transforms.length; i++) {
    var transform = transforms[i]
    var m = typeof transform.test === 'function'
      ? transform.test(uri)
      : transform.test.exec(uri)
    if (!m) continue
    return uri.replace(transform.replace, '')
  }
  return uri
}
