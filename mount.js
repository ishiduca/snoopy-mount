var path = require('path')
var window = require('global/window')
var href = require('nanohref')
var xtend = require('xtend')
var routington = require('routington')
var { through } = require('mississippi')
var multi = require('@ishiduca/snoopy-multi')

function mount (notFound, _apps) {
  notFound || (notFound = require('./notfound'))

  function reRender (u, m) {
    var label = m == null ? '*' : m.node.label
    return (render = (model, actionsUp) => (
      m == null
        ? notFound(u, null, model[label], a => actionsUp({ [label]: a }))
        : lst(m.node.values)(
          u, m.param, model[label], a => actionsUp({ [label]: a })
        )
    ))
  }

  var dummy = Object.create(null)
  var render = x => (null)
  var router = routington()
  var INIT_BIND_ROUTES = Symbol('INIT_BIND_ROUTES')
  var CHANGED_HISTORY_STATE = Symbol('CHANGED_HISTORY_STATE')
  var shadow = {
    init () {
      return {
        model: null,
        effect: INIT_BIND_ROUTES
      }
    },
    update (model, action) {
      if (action && action === CHANGED_HISTORY_STATE) {
        return { model: xtend(model) }
      }
      return { model }
    },
    view (model, actionsUp) { return model },
    run (effect, sources) {
      if (effect == null) return

      if (effect === INIT_BIND_ROUTES) {
        var s = through.obj()
        href((node) => {
          var next = prs(node.href, window.location.href)
          var nextPath = next.pathname
          reRender(next, router.match(nextPath))
          window.history.pushState(dummy, null, next.href)
          s.write(CHANGED_HISTORY_STATE)
        })

        window.onpopstate = e => {
          var c = prs(window.location.href)
          reRender(c, router.match(c.pathname))
          s.write(CHANGED_HISTORY_STATE)
        }

        return s
      }
    }
  }
  var apps = Object.keys(_apps).reduce(
    (apps, domainRootPath) => {
      var _args = [].concat(_apps[domainRootPath])
      var app = multi(lst(_args))
      var args = _args.slice(0, -1).concat(app)
      if (app.routes) {
        app.routes.forEach(([ _route, ...args ]) => {
          var route = path.resolve(path.join(domainRootPath, _route))
          var node = router.define(route)[0]
          node.values = args
          node.label = domainRootPath
        })
      }

      return xtend(apps, { [domainRootPath]: args })
    }, { '*': [ shadow ] }
  )

  var c = prs(window.location.href)
  reRender(c, router.match(c.pathname))

  function init () {
    return composeState(apps, (app) => app.init())
  }

  function update (model, action) {
    return composeState(
      apps,
      (app, domainRootPath) => (
        app.update(model[domainRootPath], action && action[domainRootPath])
      )
    )
  }

  function view (model, actionsUp) {
    return render(model, actionsUp)
  }

  function run (effect, sources) {
    if (effect == null) return
    var srcs = Object.keys(apps).map(domainRootPath => {
      if (effect[domainRootPath] == null) return
      var args = apps[domainRootPath]
      var app = lst(args)
      if (!app.run) return
      var src = app.run(effect[domainRootPath], sources)
      if (src) {
        return src.pipe(through.obj((action, _, done) => {
          done(null, { [domainRootPath]: action })
        }))
      }
    }).filter(Boolean)

    if (!srcs.length) return
    if (srcs.length === 1) return srcs[0]

    var i = 0
    var src = through.obj()
    src.on('pipe', s => (i += 1))
    src.on('unpipe', s => ((i -= 1) || src.end()))
    srcs.forEach(s => s.pipe(src, { end: false }))
    return src
  }

  return { init, update, view, run }
  // return multi({ init, update, view, run })
}

module.exports = function (notFoundApp) {
  return mount.bind(null, notFoundApp)
}
module.exports.mount = mount

function composeState (apps, f) {
  return Object.keys(apps).reduce(
    (state, domainRootPath) => {
      var args = apps[domainRootPath]
      var app = lst(args)
      var _state = f(app, domainRootPath)
      var model = composeModel(state.model, _state.model, domainRootPath)
      var effect = composeEffect(state.effect, _state.effect, domainRootPath)
      return effect != null ? { effect, model } : { model }
    }, {}
  )
}

function composeModel (model, m, domainRootPath) {
  return xtend(model, { [domainRootPath]: m })
}

function composeEffect (effect, e, domainRootPath) {
  if (effect == null && e == null) return null
  if (effect == null) return { [domainRootPath]: e }
  if (e == null) return effect
  return xtend(effect, { [domainRootPath]: e })
}

function lst (arry) { return arry[arry.length - 1] }
function prs (input, base) { return new URL(input, base) }
