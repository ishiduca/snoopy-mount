var yo = require('yo-yo')
module.exports = function notfound (uri, maybeNull, model, actionsUp) {
  return yo`<div><h1>not found :(</h1><p>${uri.href}</p></div>`
}
