var test = require('tape')
require('./lib/window')
var mount = require('mount')

test('var app = mount(notfound, domainApps)', t => {
  t.test('var updatedState = app.update(model, action)', t => {
    var m = mount()
    var app1 = {
      init () { return { model: 1 } },
      update (model, action) {
        if (action === 'INC') return { model: model + 1 }
        return { model }
      }
    }
    var appFoo = {
      init () { return { model: 'foo' } },
      update (model, action) {
        if (action === 'UPPER') return { model: model.toUpperCase() }
        return { model }
      }
    }

    t.test('action === { "/":"INC" }', t => {
      var app = m({
        '/': app1,
        '/foo': [ 'APPFOO', appFoo ]
      })
      var expected = {
        model: {
          '*': null,
          '/': 2,
          '/foo': 'foo'
        }
      }
      var initState = app.init()
      var updated = app.update(initState.model, { '/': 'INC' })
      t.deepEqual(updated, expected, JSON.stringify(updated))
      t.end()
    })

    t.test('action === { "/": "UPPER" }', t => {
      var app = m({
        '/': app1,
        '/foo': [ 'APPFOO', appFoo ]
      })
      var expected = {
        model: {
          '*': null,
          '/': 1,
          '/foo': 'foo'
        }
      }
      var initState = app.init()
      var updated = app.update(initState.model, { '/': 'UPPER' })
      t.deepEqual(updated, expected, JSON.stringify(updated))
      t.end()
    })

    t.test('action === { "/foo":"INC" }', t => {
      var app = m({
        '/': app1,
        '/foo': [ 'APPFOO', appFoo ]
      })
      var expected = {
        model: {
          '*': null,
          '/': 1,
          '/foo': 'foo'
        }
      }
      var initState = app.init()
      var updated = app.update(initState.model, { '/foo': 'INC' })
      t.deepEqual(updated, expected, JSON.stringify(updated))
      t.end()
    })

    t.test('action === { "/foo": "UPPER" }', t => {
      var app = m({
        '/': app1,
        '/foo': [ 'APPFOO', appFoo ]
      })
      var expected = {
        model: {
          '*': null,
          '/': 1,
          '/foo': 'FOO'
        }
      }
      var initState = app.init()
      var updated = app.update(initState.model, { '/foo': 'UPPER' })
      t.deepEqual(updated, expected, JSON.stringify(updated))
      t.end()
    })

    t.end()
  })

  t.test('updated = app.update(model, action) # issue effect', t => {
    var m = mount()
    var appBar = {
      init () { return { model: 'bar' } },
      update (model, action) {
        if (action === 'UPPER') {
          return { model: model.toUpperCase(), effect: 'BAR' }
        }
        return { model }
      }
    }
    var appFoo = {
      init () { return { model: 'foo' } },
      update (model, action) {
        if (action === 'UPPER') {
          return { model: model.toUpperCase(), effect: 'FOO' }
        }
        return { model }
      }
    }

    t.test('action === { "/app/foo": "UPPER" }', t => {
      var app = m({
        '/app/bar': [ appBar ],
        '/app/foo': appFoo
      })
      var initState = app.init()
      var updated = app.update(initState.model, { '/app/foo': 'UPPER' })
      var expected = {
        model: {
          '*': null,
          '/app/bar': 'bar',
          '/app/foo': 'FOO'
        },
        effect: { '/app/foo': 'FOO' }
      }
      t.deepEqual(updated, expected, JSON.stringify(updated))
      t.end()
    })

    t.test('action === { "/app/bar": "UPPER" }', t => {
      var app = m({
        '/app/bar': [ appBar ],
        '/app/foo': appFoo
      })
      var initState = app.init()
      var updated = app.update(initState.model, { '/app/bar': 'UPPER' })
      var expected = {
        model: {
          '*': null,
          '/app/bar': 'BAR',
          '/app/foo': 'foo'
        },
        effect: { '/app/bar': 'BAR' }
      }
      t.deepEqual(updated, expected, JSON.stringify(updated))
      t.end()
    })
    t.end()
  })

  t.end()
})
