var yo = require('yo-yo')
var { through } = require('mississippi')
var header = require('../header')

module.exports = {
  init () {
    return {
      model: 100,
      effect: { schedule: true }
    }
  },
  update (model, action) {
    if (model === 0) return { model }
    if (action && action.tick === true) {
      return {
        model: model - 1,
        effect: { schedule: true }
      }
    }
    return { model }
  },
  routes: [
    [ '/', appView ]
  ],
  run (effect, sources) {
    if (effect && effect.schedule === true) {
      var s = through.obj()
      setTimeout(() => s.end({ tick: true }), 1000)
      return s
    }
  }
}

function appView (u, p, model, actionsUp) {
  return yo`
    <div>
      ${header(u)}
      <div>
      <h1>${model}</h1>
      </div>
    </div>
  `
}
