import React from 'react'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'
import {ListData} from '#/main/app/content/list/containers/data'
import {constants as listConst} from '#/main/app/content/list/constants'
import {actions as listActions} from '#/main/app/content/list/store'

import {actions} from '#/plugin/forum/resources/forum/player/store/actions'
import {select} from '#/plugin/forum/resources/forum/store/selectors'
import {MessageCard} from '#/plugin/forum/resources/forum/data/components/message-card'

const FlaggedMessagesComponent = (props) =>
  <ListData
    name={`${select.STORE_NAME}.moderation.flaggedMessages`}
    fetch={{
      url: ['apiv2_forum_message_flagged_list', {forum: props.forum.id}],
      autoload: true
    }}
    delete={{
      url: ['apiv2_forum_message_delete_bulk']
    }}
    display={{
      current: listConst.DISPLAY_LIST
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
      },{
        name: 'meta.creator.username',
        type: 'string',
        label: trans('creator'),
        displayed: true,
        searchable: false
      }, {
        name: 'meta.updated',
        type: 'date',
        label: trans('last_modification'),
        displayed: true,
        option: {
          time: true
        }
      }
    ]}
    actions={(rows) => [
      {
        type: LINK_BUTTON,
        icon: 'fa fa-fw fa-eye',
        label: trans('see_message_context', {}, 'forum'),
        target: '/subjects/show/'+rows[0].subject.id,
        scope: ['object']
      }, {
        type: CALLBACK_BUTTON,
        icon: 'fa fa-fw fa-flag',
        label: trans('unflag', {}, 'forum'),
        displayed: true,
        callback: () => props.unFlag(rows[0], rows[0].subject.id)
      }
    ]}
    card={(props) => <MessageCard {...props} />}
  />



const FlaggedMessages = connect(
  state => ({
    forum: select.forum(state),
    subject: select.subject(state)
  }),
  dispatch => ({
    unFlag(message, subjectId) {
      dispatch(actions.unFlag(message, subjectId))
      dispatch(listActions.invalidateData(`${select.STORE_NAME}.moderation.flaggedMessages`))
    }
  })
)(FlaggedMessagesComponent)

export {
  FlaggedMessages
}
