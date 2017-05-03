import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore} from '#/main/core/utilities/redux'
import {reducers} from './actions'
import {SessionEvents} from './sessionEvents.jsx'
import {registerModalType} from '#/main/core/layout/modal'
import {DeleteConfirmModal} from '#/main/core/layout/modal/components/delete-confirm.jsx'
import {ConfirmModal} from '#/main/core/layout/modal/components/confirm.jsx'

registerModalType('DELETE_MODAL', DeleteConfirmModal)
registerModalType('CONFIRM_MODAL', ConfirmModal)

class SessionEventsTool {
  constructor() {
    this.store = createStore(reducers)
  }

  render(element) {
    ReactDOM.render(
      React.createElement(
        Provider,
        {store: this.store},
        React.createElement(SessionEvents)
      ),
      element
    )
  }
}

const container = document.querySelector('.session-events-tool-container')
const tool = new SessionEventsTool()

tool.render(container)