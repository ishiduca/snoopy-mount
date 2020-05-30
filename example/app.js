var mount = require('../mount')
var dashboard = require('./domains/dashboard')
var app = require('./domains/app')
var m = mount()

module.exports = m({
  '/': dashboard,
  '/app': app
})
