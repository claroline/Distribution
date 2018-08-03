import React from 'react'
import {connect} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/core/translation'
import {UserMessage} from '#/main/core/user/message/components/user-message'

import {selectors} from '#/plugin/message/selectors'

const MessageComponent = (props) =>
  <UserMessage
    user={get(props.message, 'meta.creator')}
    date={props.message.meta.created}
    content={props.message.content}
    allowHtml={true}
    actions={[
      {
        icon: 'fa fa-fw fa-trash-o',
        label: trans('delete'),
        action: () => console.log('delete'),
        dangerous: true
      }
    ]}
  />

const Message = connect(
  state => ({
    message: selectors.message(state)
  })
)(MessageComponent)
export {
  Message
}
