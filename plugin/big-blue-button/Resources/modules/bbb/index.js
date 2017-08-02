import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore} from '#/main/core/utilities/redux'
import {reducers} from './reducers'
import {BBBResource} from './components/bbb-resource.jsx'

class BBB {
  constructor(user, resource, resourceNode, serverUrl, securitySalt) {
    this.store = createStore(
      reducers,
      {
        user: user,
        resource: resource,
        resourceNode: resourceNode,
        config: {
          serverUrl: serverUrl,
          securitySalt: securitySalt
        },
        canEdit: resourceNode.rights.current.edit
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
const user = JSON.parse(container.dataset.user)
const resource = JSON.parse(container.dataset.resource)
const resourceNode = JSON.parse(container.dataset.resourceNode)
const serverUrl = container.dataset.serverUrl
const securitySalt = container.dataset.securitySalt
const bbb = new BBB(user, resource, resourceNode, serverUrl, securitySalt)

bbb.render(container)
