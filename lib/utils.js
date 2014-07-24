
exports.inlineMappingUrl = function (map) {
  if (typeof map !== 'string') map = JSON.stringify(map)
  var b64 = new Buffer(map).toString('base64')
  return '\n//# sourceMappingURL=data:application/json;base64,' + b64
}

exports.removeSourceMap = function (string) {
  return string.replace(/\/\/# sourceMappingURL=[^\n]*$/, '')
}
