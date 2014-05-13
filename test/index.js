
var walker = require('normalize-walker')
var path = require('path')
var fs = require('co-fs')
var co = require('co')

var transforms = require('..')

describe('Text', function () {
  it('.txt.js', co(function* () {
    var entrypoint = fixture('string.txt') + '.js'

    var tree = yield* walk(entrypoint)
    var file = tree[entrypoint].file
    file.string.should.equal('module.exports = ' + JSON.stringify('hello\n'))
  }))
})

describe('JSON', function () {
  it('.json.js', co(function* () {
    var entrypoint = fixture('object.json') + '.js'

    var tree = yield* walk(entrypoint)
    var file = tree[entrypoint].file
    file.string.should.equal('module.exports = {\n  "message": "lol"\n}\n')
  }))
})

describe('Autoprefixer', function () {
  it('.css', co(function* () {
    var entrypoint = fixture('test.css')

    var tree = yield* walk(entrypoint)
    tree[entrypoint].file.string.should.include('-webkit-flex')
  }))
})

describe('ES6 Modules', function () {
  it('.js', co(function* () {
    var entrypoint = fixture('module.js')

    var tree = yield* walk(entrypoint)
    var string = tree[entrypoint].file.string
    string.should.be.a.String
    string.should.not.include('import')
  }))
})

describe('Regenerator', function () {
  it('.js', co(function* () {
    var entrypoint = fixture('generator.js')

    var tree = yield* walk(entrypoint)
    var file = tree[entrypoint].file
    var string = file.string
    string.should.include('require("https://nlz.io/github/facebook/regenerator/0/runtime/dev.js")')
    string.should.not.include('function*')
  }))
})

describe('Jade', function () {
  it('.jade.js', co(function* () {
    var entrypoint = fixture('template.jade') + '.js'

    var tree = yield* walk(entrypoint)
    var file = tree[entrypoint].file
    var runtime = 'https://nlz.io/github/visionmedia/jade/1/lib/runtime.js'
    file._dependencies.should.include(runtime)
    var string = file.string
    string.should.include(runtime)
    string.should.include('module.exports = function template(locals)')
  }))

  it('.jade.html', co(function* () {
    var entrypoint = fixture('template.jade') + '.html'

    var tree = yield* walk(entrypoint)
    var file = tree[entrypoint].file
    var string = file.string

    string.should.equal('<!DOCTYPE html><html><head></head><body></body></html>')
  }))

  it('.jade.html.js', co(function* () {
    var entrypoint = fixture('template.jade') + '.html.js'

    var tree = yield* walk(entrypoint)
    var file = tree[entrypoint].file
    var string = file.string

    string.should.equal('module.exports = ' + JSON.stringify('<!DOCTYPE html><html><head></head><body></body></html>'))
  }))
})

describe('Markdown', function () {
  it('.md.html', co(function* () {
    var entrypoint = fixture('stuff.md') + '.html'

    var tree = yield* walk(entrypoint)
    var file = tree[entrypoint].file
    file.string.should.equal('<h1 id=\"hello\">hello</h1>\n')
  }))

  it('.md.html.js', co(function* () {
    var entrypoint = fixture('stuff.md') + '.html.js'

    var tree = yield* walk(entrypoint)
    var file = tree[entrypoint].file
    file.string.should.equal('module.exports = ' + JSON.stringify('<h1 id="hello">hello</h1>\n'))
  }))
})

describe('React', function () {
  it('.jsx.js', co(function* () {
    var entrypoint = fixture('template.jsx') + '.js'

    var tree = yield* walk(entrypoint)
    var file = tree[entrypoint].file
    var string = file.string
    string.should.include("{displayName: 'HelloMessage',")
    string.should.not.include('<div>Hello {this.props.name}</div>')
  }))
})

describe('Domify', function () {
  it('.html.domify.js', co(function* () {
    var entrypoint = fixture('template.html') + '.domify.js'

    var tree = yield* walk(entrypoint)
    var file = tree[entrypoint].file
    var string = file.string

    string.should.include('var domify = require("https://nlz.io/github/component/domify/1/index.js")')
    string.should.include('domify('
      + JSON.stringify('<!DOCTYPE html><html><head></head><body></body></html>\n')
      + ')')
  }))

  it('.jade.html.domify.js', co(function* () {
    var entrypoint = fixture('template.jade') + '.html.domify.js'

    var tree = yield* walk(entrypoint)
    var file = tree[entrypoint].file
    var string = file.string

    string.should.include('var domify = require("https://nlz.io/github/component/domify/1/index.js")')
    string.should.include('domify('
      + JSON.stringify('<!DOCTYPE html><html><head></head><body></body></html>')
      + ')')
  }))

  it('.md.html.domify.js', co(function* () {
    var entrypoint = fixture('stuff.md') + '.html.domify.js'

    var tree = yield* walk(entrypoint)
    var file = tree[entrypoint].file
    var string = file.string

    string.should.include('var domify = require("https://nlz.io/github/component/domify/1/index.js")')
    string.should.include('domify('
      + JSON.stringify('<h1 id="hello">hello</h1>\n')
      + ')')
  }))
})

describe('UglifyJS', function () {
  it('.js', co(function* () {
    var entrypoint = fixture('something.js')
    var tree = yield* walk(entrypoint)
    var file = tree[entrypoint].file

    file.minified.should.be.a.String
    file.minifiedLength.should.equal(Buffer.byteLength(file.minified))
    file.minifiedLength.should.be.below(Buffer.byteLength(file.string))
  }))
})

describe('CleanCSS', function () {
  it('.css', co(function* () {
    var entrypoint = fixture('test.css')
    var tree = yield* walk(entrypoint)
    var file = tree[entrypoint].file

    file.minified.should.be.a.String
    file.minifiedLength.should.equal(Buffer.byteLength(file.minified))
    file.minifiedLength.should.be.below(Buffer.byteLength(file.string))
  }))
})

function walk(entrypoint) {
  return walker()
    .use(ignoreRemotes)
    .use(transforms())
    .add(entrypoint)
    .tree()
}

function fixture(name) {
  return path.join(__dirname, 'fixtures', name)
}

function* ignoreRemotes(next) {
  yield* next

  var deps = this.file.dependencies
  var _deps = this.file._dependencies = []
  Object.keys(deps).forEach(function (name) {
    if (!~name.indexOf('://')) return
    delete deps[name]
    _deps.push(name)
  })
}
