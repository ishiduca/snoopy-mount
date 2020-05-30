var window = require('global/window')
window.location || (window.location = {})
window.location.href || (window.location.href = 'http://test.tt')

module.exports = function (dummy) {
  if (dummy) window.location.href = dummy
  return window
}
