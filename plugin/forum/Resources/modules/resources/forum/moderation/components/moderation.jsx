import React from 'react'
// import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {UserMessage} from '#/main/core/user/message/components/user-message'

import {select} from '#/plugin/forum/resources/forum/selectors'

const FlaggedMessage = () =>
  <ul className="posts">
    {this.props.flaggedMessages.map(message =>
      <li key={message.id} className="post">
        <UserMessage
          user={message.meta.creator}
          date={message.meta.created}
          content={message.content}
          allowHtml={true}
          actions={[
            {
              icon: 'fa fa-fw fa-pencil',
              label: trans('edit'),
              displayed: true,
              action: () => this.setState({showMessageForm: message.id})
            }, {
              icon: 'fa fa-fw fa-flag',
              label: trans('flag', {}, 'forum'),
              displayed: true,
              action: () => this.props.flagMessage(message, message.subject.id)
            }, {
              icon: 'fa fa-fw fa-trash-o',
              label: trans('delete'),
              displayed: true,
              action: () => this.deleteMessage(message.id),
              dangerous: true
            }
          ]}
        />
      </li>
    )}
  </ul>

const ModerationComponent = () =>
  <div>
    Modération
  </div>

const Moderation = connect(
  state => ({
    subject: select.subject(state)
  })
)(ModerationComponent)

export {
  Moderation
}
