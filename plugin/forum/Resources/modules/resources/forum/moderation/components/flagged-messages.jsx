import React from 'react'
// import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {DataListContainer} from '#/main/core/data/list/containers/data-list'
import {constants as listConst} from '#/main/core/data/list/constants'
import {DataCard} from '#/main/core/data/components/data-card'
import {UserAvatar} from '#/main/core/user/components/avatar'
import {actions as listActions} from '#/main/core/data/list/actions'

import {actions} from '#/plugin/forum/resources/forum/player/actions'
import {select} from '#/plugin/forum/resources/forum/selectors'


const FlaggedMessagesComponent = (props) =>

  <DataListContainer
    name="moderation.flaggedMessages"
    fetch={{
      url: ['apiv2_forum_message_flagged_list', {forum: props.forum.id}],
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
      }, {
        type: 'callback',
        icon: 'fa fa-fw fa-flag',
        label: trans('unflag', {}, 'forum'),
        displayed: true,
        callback: () => props.unFlag(rows[0], rows[0].subject.id)
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



const FlaggedMessages = connect(
  state => ({
    forum: select.forum(state),
    subject: select.subject(state)
  }),
  dispatch => ({
    unFlag(message, subjectId) {
      dispatch(actions.unFlag(message, subjectId))
      dispatch(listActions.invalidateData('moderation.flaggedMessages'))
    }
  })
)(FlaggedMessagesComponent)

export {
  FlaggedMessages
}
