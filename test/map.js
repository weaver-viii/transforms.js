
var assert = require('assert')

var map = require('..').map

describe('Mappings', function () {
  ;[
    ['.txt.js', '.txt'],
    ['.json.js', '.json'],
    ['.jade.js', '.jade'],
    ['.jade.html', '.jade'],
    ['.md.html', '.md'],
    ['.md.html.js', '.md'],
    ['.md.html.domify.js', '.md'],
    ['.jsx.js', '.jsx'],
    ['.html.domify.js', '.html'],
    ['.jade.html.domify.js', '.jade'],
    ['.coffee.js', '.coffee'],
    ['.less.css', '.less'],
    ['.sass.css', '.sass'],
    ['.scss.css', '.scss'],
    ['.styl.css', '.styl'],
    ['.html.js', '.html'],
  ].forEach(function (pair) {
    it(pair[0] + ' -> ' + pair[1], function () {
      assert.equal('asdf' + pair[1], map('asdf' + pair[0]))
    })
  })
})
