var test = require('tape')
var setHref = require('./lib/window')
var url = require('url')
var mount = require('mount')

test('var app = mount(notfound, domainApps)', t => {
  t.test('notfound(uriObj, params, model, actionsUp)', t => {
    var testUri = 'http://dum.my'
    setHref(testUri)

    var expectedUri = url.parse(testUri, true)
    var notFound = (u, p, m, up) => {
      t.deepEqual(u, expectedUri, `1st args "url object" - ${testUri}`)
      t.is(p, null, '2nd args "params" - null')
      t.is(m, 1, '3rd args "model" - "1"')
      up(true)
    }
    var dashboard = (u, p, m, up) => t.fail()
    var appDashboard = { routes: [ [ '/', dashboard ] ] }
    var m = mount(notFound)
    var app = m({ '/dashboard': appDashboard })
    app.view({ '*': 1 }, (action) => {
      t.deepEqual(action, { '*': true }, 'action - { "*": true }')
      t.end()
    })
  })

  t.test('dashboard(uriObj, params, model, actionsUp)', t => {
    var testUri = 'http://dum.my/dashboard'
    setHref(testUri)

    var expectedUri = url.parse(testUri, true)
    var notFound = () => t.fail()
    var dashboard = (u, p, m, up) => {
      t.deepEqual(u, expectedUri, `1st args "url object" - ${testUri}`)
      t.deepEqual(p, {}, '2nd args "params" - {}')
      t.deepEqual(m, 'DASH', '3rd args "model" - "DASH"')
      up({ dash: 'go' })
    }
    var appDashboard = { routes: [ [ '/', dashboard ] ] }
    var m = mount(notFound)
    var app = m({ '/dashboard': appDashboard })

    app.view({ '/dashboard': 'DASH' }, (action) => {
      t.deepEqual(action, { '/dashboard': { dash: 'go' } }, 'action { "/dashboard": { dash: "go" } }')
      t.end()
    })
  })

  t.test('dashboard(uriObj, params, model, actionsUp) # with params', t => {
    var testUri = 'http://dum.my/dashboard/Gon/child/Ponta'
    setHref(testUri)

    var expectedUri = url.parse(testUri, true)
    var notFound = () => t.fail()
    var dashboard = (u, p, m, up) => {
      t.deepEqual(u, expectedUri, `1st args "url object" - ${testUri}`)
      t.deepEqual(p, { Account: 'Gon', child: 'Ponta' }, '{ Account: "Gon", child: "Ponta" }')
      t.deepEqual(m, null, '3rd args "model" - null')
      up({ dash: 'go' })
    }
    var appDashboard = { routes: [ [ '/:Account/child/:child', dashboard ] ] }
    var m = mount(notFound)
    var app = m({ '/dashboard': appDashboard })

    app.view({ '/dashboard': null }, (action) => {
      t.deepEqual(action, { '/dashboard': { dash: 'go' } }, 'action { "/dashboard": { dash: "go" } }')
      t.end()
    })
  })

  t.end()
})
