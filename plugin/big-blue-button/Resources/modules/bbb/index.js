import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore} from '#/main/core/utilities/redux'
import {reducers} from './reducers'
import {BBBResource} from './components/bbb-resource.jsx'

class BBB {
  constructor(resourceNode, serverUrl, securityKey) {
    this.store = createStore(
      reducers,
      {
        resourceNode: resourceNode,
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
        React.createElement(BBBResource)
      ),
      element
    )
  }
}

const container = document.querySelector('.bbb-container')
const resourceNode = JSON.parse(container.dataset.resourceNode)
const serverUrl = container.dataset.serverUrl
const securityKey = container.dataset.securityKey
const bbb = new BBB(resourceNode, serverUrl, securityKey)

bbb.render(container)
