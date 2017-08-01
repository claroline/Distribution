import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore} from '#/main/core/utilities/redux'
import {reducers} from './reducers'
import {BBBConfigForm} from './components/bbb-config-form.jsx'

class BBBConfig {
  constructor(serverUrl, securitySalt) {
    this.store = createStore(
      reducers,
      {
        serverUrl: serverUrl,
        securitySalt: securitySalt
      }
    )
  }

  render(element) {
    ReactDOM.render(
      React.createElement(
        Provider,
        {store: this.store},
        React.createElement(BBBConfigForm)
      ),
      element
    )
  }
}

const container = document.querySelector('.bbb-config-container')
const serverUrl = container.dataset.serverUrl
const securitySalt = container.dataset.securitySalt
const bbbConfig = new BBBConfig(serverUrl, securitySalt)

bbbConfig.render(container)