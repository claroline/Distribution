import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore} from '#/main/core/utilities/redux'
import {reducers} from './reducers'
import {BBBConfigForm} from './components/bbb-config-form.jsx'

class BBBConfig {
  constructor(serverUrl, securityKey) {
    this.store = createStore(
      reducers,
      {
        serverUrl: serverUrl,
        securityKey: securityKey
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
const securityKey = container.dataset.securityKey
const bbbConfig = new BBBConfig(serverUrl, securityKey)

bbbConfig.render(container)