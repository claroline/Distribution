import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore} from '#/main/core/utilities/redux'
import {reducers} from './reducers'
import {Workspaces} from './workspaces.jsx'

class WorkspaceAdministration {
  constructor(workspaceData) {
    this.store = createStore(reducers, {pager: workspaceData})
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
const count = container.dataset.count
const adminTool = new WorkspaceAdministration({workspaces, count})

adminTool.render(container)
