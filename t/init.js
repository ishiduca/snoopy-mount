var test = require('tape')
require('./lib/window')
var mount = require('mount')

test('var app = mount(notfound, domainApps)', t => {
  var strShadowEffect = 'Symbol(INIT_BIND_ROUTES)'

  t.test('var initState = app.init()', t => {
    var m = mount()
    var app1 = { init () { return { model: 1 } } }
    var appFoo = { init () { return { model: 'foo' } } }
    var app = m({
      '/': [ 'APP1', app1 ],
      '/foo': [ 'APPFOO', appFoo ]
    })
    var expected = {
      model: {
        '*': null,
        '/': 1,
        '/foo': 'foo'
      },
      effect: {
        '*': strShadowEffect
      }
    }
    var initState = app.init()
    t.is(String(initState.effect['*']), strShadowEffect,
      'initState.effect["*"] "Symbol(INIT_BIND_ROUTES)"'
    )
    initState.effect['*'] = strShadowEffect
    t.deepEqual(initState, expected, JSON.stringify(initState))
    t.end()
  })

  t.test('var initState = app.init() # issue effect', t => {
    var m = mount()
    var app1 = { init () { return { model: 1 } } }
    var appFoo = { init () { return { model: 'foo', effect: 'FOO' } } }
    var app = m({
      '/': [ 'APP1', app1 ],
      '/foo': [ 'APPFOO', appFoo ]
    })
    var expected = {
      model: {
        '*': null,
        '/': 1,
        '/foo': 'foo'
      },
      effect: {
        '*': strShadowEffect,
        '/foo': 'FOO'
      }
    }
    var initState = app.init()
    initState.effect['*'] = strShadowEffect
    t.deepEqual(initState, expected, JSON.stringify(initState))
    t.end()
  })

  t.end()
})
