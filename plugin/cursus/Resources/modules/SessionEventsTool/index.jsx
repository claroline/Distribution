import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore} from '#/main/core/utilities/redux'
import {reducers} from './actions'
import {VIEW_MANAGER, VIEW_USER, viewComponents} from './views'

class SessionEventsTool {
  constructor(canEdit, sessions, events) {
    const sessionId = sessions.length === 1 ? sessions[0]['id'] : null
    this.mode = canEdit ? VIEW_MANAGER : VIEW_USER
    this.store = createStore(
      reducers,
      {
        canEdit: canEdit,
        sessions: sessions,
        sessionId: sessionId,
        events: events,
        mode: this.mode
      }
    )
  }

  render(element) {
    ReactDOM.render(
      React.createElement(
        Provider,
        {store: this.store},
        React.createElement(viewComponents[this.mode])
      ),
      element
    )
  }
}

const container = document.querySelector('.session-events-tool-container')
const canEdit = parseInt(container.dataset.editable)
const sessions = JSON.parse(container.dataset.sessions)
const events = JSON.parse(container.dataset.events)
const tool = new SessionEventsTool(canEdit, sessions, events)

tool.render(container)