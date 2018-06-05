import React from 'react'
// import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans, transChoice} from '#/main/core/translation'
import {asset} from '#/main/core/scaffolding/asset'
import {DataListContainer} from '#/main/core/data/list/containers/data-list'
import {constants as listConst} from '#/main/core/data/list/constants'
import {DataCard} from '#/main/core/data/components/data-card'
import {UserAvatar} from '#/main/core/user/components/avatar'


import {select} from '#/plugin/forum/resources/forum/selectors'
import {actions} from '#/plugin/forum/resources/forum/player/actions'

const FlaggedMessagesComponent = (props) =>
  <div>
    <h2>{trans('flagged_messages_subjects', {}, 'forum')}</h2>
    <DataListContainer
      name="flaggedPosts"
      fetch={{
        url: url('apiv2_forum_message_list')+'filters[flagged]=true&filters[forum]='+props.forum.id,
        autoload: true
      }}
      delete={{
        url: ['apiv2_forum_message_delete_bulk']
      }}
      primaryAction={(subject) => ({
        type: 'link',
        target: '/subjects/show/'+subject.id,
        label: trans('open', {}, 'actions')
      })}
      display={{
        current: listConst.DISPLAY_LIST_SM
      }}
      definition={[
        {
          name: 'title',
          type: 'string',
          label: trans('title'),
          displayed: true,
          primary: true
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
          icon: 'fa fa-fw fa-pencil',
          label: trans('edit'),
          target: '/subjects/form/'+rows[0].id,
          context: 'row'
        }, {
          icon: 'fa fa-fw fa-flag',
          label: trans('unflag', {}, 'forum'),
          displayed: true,
          action: () => console.log('unflag')
        }
      ]}
      card={(props) =>
        <DataCard
          {...props}
          id={props.data.id}
          icon={<UserAvatar picture={props.data.meta.creator ? props.data.meta.creator.picture : undefined} alt={true}/>}
          title={props.data.title}
          poster={props.data.poster ? asset(props.data.poster.url) : null}
          subtitle={transChoice('replies', props.data.meta.messages, {count: props.data.meta.messages}, 'forum')}
          // contentText={props.data)}
        />
      }
    />
  </div>


const FlaggedMessages = connect(
  state => ({
    forum: select.forum(state),
    subject: select.subject(state)
  })
)(FlaggedMessagesComponent)

export {
  FlaggedMessages
}
