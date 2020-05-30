var yo = require('yo-yo')
var app = require('./app')
var document = require('global/document')
var { start } = require('@ishiduca/snoopy')
var { views, models, actions } = start(app)

var root = document.createElement('div')

views().on('data', rt => yo.update(root, rt))
models().on('data', model => console.log({ model }))
actions().on('data', action => console.log({ action }))

document.body.appendChild(root)
