var yo = require('yo-yo')
var header = require('../header')

module.exports = {
  init () {
    return {
      model: {
        accounts: {
          shimura: {
            name: '志村',
            greetsMsg: 'こんちわ。'
          },
          tim: {
            name: 'Tim',
            greetsMsg: 'Hello'
          },
          monica: {
            name: 'monica dance',
            greetsMsg: 'dance!'
          }
        }
      }
    }
  },
  update (model, action) {
    return { model }
  },
  routes: [
    [ '/', dashboardIndexView ],
    [ '/a/:account', dashboardAccountView ]
  ]
}

function dashboardIndexView (u, p, { accounts }, actionsUp) {
  return yo`
    <div>
      ${header(u)}
      <ul>
        ${Object.keys(accounts).map(id => yo`
          <li><a href="/a/${id}">${accounts[id].name}</a></li>    
        `)}
      </ul>
    </div>
  `
}

function dashboardAccountView (u, p, { accounts }, actionsUp) {
  var account = accounts[p.account]
  return yo`
    <div>
      ${header(u)}
      <h1>${account.name}</h1>
      <p>${account.greetsMsg}</p>
    </div>
  `
}
