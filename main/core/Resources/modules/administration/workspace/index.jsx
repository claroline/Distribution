import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore} from '#/main/core/utilities/redux'
import {reducers} from './actions'
import {Workspaces} from './workspaces.jsx'

class WorkspaceAdministration {
  constructor(workspaceData, user) {
    workspaceData.selected = []
    this.store = createStore(reducers, {pagination: workspaceData, user})
  }

  render(element) {
    ReactDOM.render(
      React.createElement(
        Provider,
        {store: this.store},
        React.createElement(Workspaces)
      ),
      element
    )
  }
}

const container = document.querySelector('.workspace-administration-container')
const workspaces = JSON.parse(container.dataset.workspaces)
const count = parseInt(container.dataset.count)
const user = JSON.parse(container.dataset.user)
const adminTool = new WorkspaceAdministration({data: workspaces, totalResults: count}, user)

adminTool.render(container)
