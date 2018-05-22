import React from 'react'
// import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {TabbedPageContainer} from '#/main/core/layout/tabs'
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
    {/* <h2>{trans('moderation', {}, 'forum')}</h2> */}
    <TabbedPageContainer
      title={trans('moderation', {}, 'forum')}
      tabs={[
        {
          icon: 'fa fa-flag',
          title: trans('flagged_messages_subjects', {}, 'forum'),
          path: '/flagged',
          content: FlaggedMessage,
          displayed: true
        },
        {
          icon: 'fa fa-ban',
          title: trans('moderated_posts', {}, 'forum'),
          path: '/moderated',
          // content: UserTab,
          // //perm check here for creation
          // actions: permLevel === MANAGER || permLevel === ADMIN ? UserTabActions: null,
          displayed: true
        }
      ]}
    />
  </div>

const Moderation = connect(
  state => ({
    subject: select.subject(state)
  })
)(ModerationComponent)

export {
  Moderation
}
