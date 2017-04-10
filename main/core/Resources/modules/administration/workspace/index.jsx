import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore} from '../../react/store/store'
import {reducers} from './reducers'

class WorkspaceAdministration {
  constructor(workspaceData, noServer = false) {
    this.store = createStore(Object.assign({noServer: noServer}, {pager: workspaceData}), reducers)
  }

  getJsx() {
    return (
      <div>
          yolo
      </div>
    )
  }

  render(element) {
    ReactDOM.render(
      React.createElement(
        Provider,
        {store: this.store},
        this.getJsx()
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
