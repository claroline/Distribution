import React from 'react'
// import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {UserMessage} from '#/main/core/user/message/components/user-message'

import {select} from '#/plugin/forum/resources/forum/selectors'

const FlaggedMessagesComponent = () =>
  // <ul className="posts">
  //   {this.props.flaggedMessages.map(message =>
  //     <li key={message.id} className="post">
  //       <UserMessage
  //         user={message.meta.creator}
  //         date={message.meta.created}
  //         content={message.content}
  //         allowHtml={true}
  //         actions={[
  //           {
  //             icon: 'fa fa-fw fa-pencil',
  //             label: trans('edit'),
  //             displayed: true,
  //             action: () => this.setState({showMessageForm: message.id})
  //           }, {
  //             icon: 'fa fa-fw fa-trash-o',
  //             label: trans('delete'),
  //             displayed: true,
  //             action: () => this.deleteMessage(message.id),
  //             dangerous: true
  //           }
  //         ]}
  //       />
  //     </li>
  //   )}
  // </ul>
  <div>Flagged Messages</div>


const FlaggedMessages = connect(
  state => ({
    subject: select.subject(state)
  })
)(FlaggedMessagesComponent)

export {
  FlaggedMessages
}
