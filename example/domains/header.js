var yo = require('yo-yo')
module.exports = (uri) => yo`
  <header>
    <ul>
      <li><a href="/">dashboard</a></li>
      <li><a href="/app">app</a></li>
      <li><a href="/noop">not found example</a></li>
    </ul>
    <p>here: ${uri.href}</p>
  </header>
`
