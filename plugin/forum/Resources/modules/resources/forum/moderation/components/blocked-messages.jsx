import React from 'react'
// import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {DataListContainer} from '#/main/core/data/list/containers/data-list'
import {constants as listConst} from '#/main/core/data/list/constants'
import {DataCard} from '#/main/core/data/components/data-card'
import {UserAvatar} from '#/main/core/user/components/avatar'
import {actions as listActions} from '#/main/core/data/list/actions'

import {select} from '#/plugin/forum/resources/forum/selectors'
import {actions} from '#/plugin/forum/resources/forum/actions'

const BlockedMessagesComponent = (props) =>
  <div>
    <h2>{trans('moderated_posts', {}, 'forum')}</h2>
    <DataListContainer
      name="moderation.blockedMessages"
      fetch={{
        url: ['apiv2_forum_message_blocked_list', {forum: props.forum.id}],
        autoload: true
      }}
      delete={{
        url: ['apiv2_forum_message_delete_bulk']
      }}
      display={{
        current: listConst.DISPLAY_LIST_SM
      }}
      definition={[
        {
          name: 'content',
          type: 'string',
          label: trans('message'),
          displayed: true,
          primary: true
        }, {
          name: 'subject.title',
          type: 'string',
          label: trans('subject_title', {}, 'forum'),
          displayed: true
        }, {
          name: 'meta.updated',
          type: 'date',
          label: trans('last_modification'),
          displayed: true,
          option: {
            time: true
          }
        }
      // {
      //   name: 'meta.creator',
      //   type: 'string',
      //   label: trans('creator'),
      //   displayed: true
      // }
      ]}
      actions={(rows) => [
        {
          type: 'link',
          icon: 'fa fa-fw fa-eye',
          label: trans('see_message_context', {}, 'forum'),
          target: '/subjects/show/'+rows[0].subject.id,
          context: 'row'
        },
        // if moderation all => validateMessage
        // if moderation once => validateUser
        {
          type: 'callback',
          icon: 'fa fa-fw fa-check',
          label: trans('validate_message', {}, 'forum'),
          displayed: props.forum.moderation === 'PRIOR_ALL',
          callback: () => props.validateMessage(rows[0], rows[0].subject.id)
        }, {
          type: 'callback',
          icon: 'fa fa-fw fa-check',
          label: trans('validate_user', {}, 'forum'),
          displayed: props.forum.moderation === 'PRIOR_ONCE',
          callback: () => props.validateUser(rows[0], rows[0].subject.id)
        }
      ]}
      card={(props) =>
        <DataCard
          {...props}
          id={props.data.id}
          icon={<UserAvatar picture={props.data.meta.creator ? props.data.meta.creator.picture : undefined} alt={true}/>}
          title={props.data.content}
          subtitle={props.data.subject.title}
        />
      }
    />
  </div>


const BlockedMessages = connect(
  state => ({
    forum: select.forum(state),
    subject: select.subject(state)
  }),
  dispatch => ({
    validateMessage(message, subjectId) {
      dispatch(actions.validateMessage(message, subjectId))
    },
    validateUser(message, subjectId) {
      dispatch(actions.validateUser(message, subjectId))
    }
  })
)(BlockedMessagesComponent)

export {
  BlockedMessages
}
