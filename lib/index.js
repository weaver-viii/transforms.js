
var fs = require('fs')
var path = require('path')
var compose = require('composition')
var plugins = require('deps-walk').plugins

module.exports = transform

fs.readdirSync(__dirname).forEach(function (type) {
  if (type[0] === '.') return
  if (/\.js$/.test(type)) return
  fs.readdirSync(path.join(__dirname, type)).forEach(function (name) {
    if (name[0] === '.') return
    name = name.replace(/\.js$/, '')
    transform[name] = require('./' + type + '/' + name)
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
