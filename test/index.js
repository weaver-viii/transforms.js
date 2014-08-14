
var walker = require('normalize-walker')
var assert = require('assert')
var path = require('path')
var fs = require('co-fs')
var co = require('co')

var transforms = require('..')

describe('Text', function () {
  it('.txt.js', co(function* () {
    var entrypoint = fixture('string.txt') + '.js'

    var tree = yield* walk(entrypoint)
    var file = tree[entrypoint].file
    assert.equal('export default ' + JSON.stringify('hello\n'), file.string.trim())
  }))
})

describe('JSON', function () {
  it('.json.js', co(function* () {
    var entrypoint = fixture('object.json') + '.js'

    var tree = yield* walk(entrypoint)
    var file = tree[entrypoint].file
    assert.equal('export default {\n  "message": "lol"\n}', file.string.trim())
  }))
})

describe('Jade', function () {
  it('.jade.js', co(function* () {
    var entrypoint = fixture('template.jade') + '.js'

    var tree = yield* walk(entrypoint)
    var file = tree[entrypoint].file
    var version = require('jade/package.json').version
    var runtime = 'https://nlz.io/github/visionmedia/jade/' + version + '/lib/runtime.js'
    file._dependencies.should.include(runtime)
    var string = file.string
    string.should.include(runtime)
    string.should.include('export default function template(locals)')
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
    var string = file.string.trim()

    string.should.equal('export default ' + JSON.stringify('<!DOCTYPE html><html><head></head><body></body></html>'))
  }))
})

describe('Markdown', function () {
  it('.md.html', co(function* () {
    var entrypoint = fixture('stuff.md') + '.html'

    var tree = yield* walk(entrypoint)
    var file = tree[entrypoint].file
    file.string.trim().should.equal('<h1 id=\"hello\">hello</h1>')
  }))

  it('.md.html.js', co(function* () {
    var entrypoint = fixture('stuff.md') + '.html.js'

    var tree = yield* walk(entrypoint)
    var file = tree[entrypoint].file
    file.string.trim().should.equal('export default ' + JSON.stringify('<h1 id="hello">hello</h1>\n'))
  }))
})

describe('React', function () {
  it('.jsx.js', co(function* () {
    var entrypoint = fixture('template.jsx') + '.js'

    var tree = yield* walk(entrypoint)
    var file = tree[entrypoint].file
    var string = file.string.trim()
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

    string.should.include('import domify from "https://nlz.io/github/component/domify/1/index.js"')
    string.should.include('domify('
      + JSON.stringify('<!DOCTYPE html><html><head></head><body></body></html>\n')
      + ')')
  }))

  it('.jade.html.domify.js', co(function* () {
    var entrypoint = fixture('template.jade') + '.html.domify.js'

    var tree = yield* walk(entrypoint)
    var file = tree[entrypoint].file
    var string = file.string

    string.should.include('import domify from "https://nlz.io/github/component/domify/1/index.js"')
    string.should.include('domify('
      + JSON.stringify('<!DOCTYPE html><html><head></head><body></body></html>')
      + ')')
  }))

  it('.md.html.domify.js', co(function* () {
    var entrypoint = fixture('stuff.md') + '.html.domify.js'

    var tree = yield* walk(entrypoint)
    var file = tree[entrypoint].file
    var string = file.string

    string.should.include('import domify from "https://nlz.io/github/component/domify/1/index.js"')
    string.should.include('domify('
      + JSON.stringify('<h1 id="hello">hello</h1>\n')
      + ')')
  }))
})

describe('CoffeeScript', function () {
  it('.coffee.js', co(function* () {
    var entrypoint = fixture('coffee-test.js')
    var tree = yield* walk(entrypoint)
    var file = tree[entrypoint].file.dependencies['test.coffee.js'].file

    assert(file.map)
    file.string.trim().should.equal("console.log('lol');")
  }))
})

describe('LESS', function () {
  it('.less.css', co(function* () {
    var entrypoint = fixture('less-test.css')
    var tree = yield* walk(entrypoint)
    var file = tree[entrypoint].file.dependencies['test.less.css'].file

    file.string.trim().should.equal(".class {\n  width: 2;\n}")
  }))
})

describe('SASS', function () {
  it('.sass.css', co(function* () {
    var entrypoint = fixture('sass-test.css')
    var tree = yield* walk(entrypoint)
    var file = tree[entrypoint].file.dependencies['test.sass.css'].file

    file.string.trim().should.equal(".class {\n  width: 2; }")
  }))

  it('.scss.css', co(function* () {
    var entrypoint = fixture('sass-test.css')
    var tree = yield* walk(entrypoint)
    var file = tree[entrypoint].file.dependencies['test.scss.css'].file

    file.string.trim().should.equal(".class {\n  width: 2; }")
  }))
})

describe('Stylus', function () {
  it('.styl.css', co(function* () {
    var entrypoint = fixture('stylus-test.css')
    var tree = yield* walk(entrypoint)
    var file = tree[entrypoint].file.dependencies['test.styl.css'].file

    file.string.trim().should.equal("body {\n  color: #f00;\n}")
  }))
})

describe('Shebangs', function () {
  it('should be commented out', co(function* () {
    var entrypoint = fixture('shebang.js')
    var tree = yield* walk(entrypoint)
    var file = tree[entrypoint].file

    file.string.trim().should.equal('// #!/usr/bin/env node')
  }))
})

describe('HTML', function () {
  it('.html', co(function* () {
    var entrypoint = fixture('template.html')
    var tree = yield* walk(entrypoint)
    var file = tree[entrypoint].file

    assert(file.string)
  }))

  it('.html.js', co(function* () {
    var entrypoint = fixture('template.html') + '.js'

    var tree = yield* walk(entrypoint)
    var file = tree[entrypoint].file

    assert.equal(0, file.string.indexOf('export default'))
    assert(~file.string.indexOf('<html>'))
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
