import React from 'react'
import {connect} from 'react-redux'

import {Router, Routes} from '#/main/app/router'

import {ReceivedMessages} from '#/plugin/message/components/received-messages'
import {SentMessages} from '#/plugin/message/components/sent-messages'
import {DeletedMessages} from '#/plugin/message/components/deleted-messages'
import {NewMessage} from '#/plugin/message/components/new-message'
import {Message} from '#/plugin/message/components/message'
import {actions} from '#/plugin/message/actions'
import {constants} from '#/plugin/message/constants'

const MessagesComponent = (props) =>
  <Router>
    <Routes
      redirect={[
        {from: '/', exact: true, to: '/received' }
      ]}
      routes={[
        {
          path: '/received',
          exact: true,
          component: ReceivedMessages,
          onEnter: () => {
            props.setTitle(constants.RECEIVED_MESSAGE_TITLE)
          }
        }, {
          path: '/sent',
          exact: true,
          component: SentMessages,
          onEnter: () => props.setTitle(constants.SENT_MESSAGE_TITLE)
        }, {
          path: '/deleted',
          exact: true,
          component: DeletedMessages,
          onEnter: () => props.setTitle(constants.DELETED_MESSAGE_TITLE)
        }, {
          path: '/new',
          exact: true,
          component: NewMessage,
          onEnter: () => {
            props.setTitle(constants.NEW_MESSAGE_TITLE)
            props.newMessage()
          }
        }, {
          path: '/message/:id?',
          exact: true,
          component: Message,
          onEnter: (params) => {
            props.setTitle(constants.MESSAGE_TITLE)
            props.openMessage(params.id)
            props.newMessage(params.id)
          }
        }
      ]}
    />
  </Router>

const Messages = connect(
  null,
  dispatch => ({
    openMessage(id) {
      dispatch(actions.openMessage(id))
    },
    setTitle(title) {
      dispatch(actions.setTitle(title))
    },
    newMessage(id) {
      dispatch(actions.newMessage(id))
    }
  })
)(MessagesComponent)


export {
  Messages
}
