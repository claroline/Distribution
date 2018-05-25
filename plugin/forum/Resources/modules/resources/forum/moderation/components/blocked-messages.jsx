import React from 'react'
// import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {UserMessage} from '#/main/core/user/message/components/user-message'

import {select} from '#/plugin/forum/resources/forum/selectors'

const BlockedMessagesComponent = () =>
  <div>BlockedMessage</div>


const BlockedMessages = connect(
  state => ({
    subject: select.subject(state)
  })
)(BlockedMessagesComponent)

export {
  BlockedMessages
}
