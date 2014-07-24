
exports.inlineMappingUrl = function (map) {
  var b64 = new Buffer(JSON.stringify(map)).toString('base64')
  return '\n//# sourceMappingURL=data:application/json;base64,' + b64
}
