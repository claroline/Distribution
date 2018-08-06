import React from 'react'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'
import {ListData} from '#/main/app/content/list/containers/data'


const SentMessages = () =>
  <div>
    <h2>{trans('messages_removed')}</h2>
    <ListData
      name="messagesSent"
      fetch={{
        url: [],
        autoload: true
      }}
      delete={{
        url: []
      }}
      primaryAction={(message) => ({
        type: LINK_BUTTON,
        target: '/message/'+message.id,
        label: trans('open', {}, 'actions')
      })}
      // display={{
      //   current: props.forum.display.subjectDataList || listConst.DISPLAY_LIST
      // }}
      definition={[
        {
          name: 'subject',
          type: 'string',
          label: trans('message_form_object'),
          displayed: true,
          primary: true
        }, {
          name: 'meta.creator.username',
          type: 'number',
          label: trans('posts_count', {}, 'forum'),
          displayed: true,
          filterable: false,
          sortable: true
        }, {
          name: 'meta.created',
          type: 'string',
          label: trans('creator'),
          displayed: true,
          searchable: true,
          filterable: true,
          alias: 'creator'
        }
      ]}
      // actions={(rows) => [
      //   {
      //     type: LINK_BUTTON,
      //     icon: 'fa fa-fw fa-eye',
      //     label: trans('see_subject', {}, 'forum'),
      //     target: '/subjects/show/'+rows[0].id,
      //     context: 'row'
      //   }, {
      //     type: CALLBACK_BUTTON,
      //     icon: 'fa fa-fw fa-flag-o',
      //     label: trans('flag', {}, 'forum'),
      //     displayed: !rows[0].meta.flagged && (rows[0].meta.creator.id !== authenticatedUser.id),
      //     callback: () => props.flagSubject(rows[0]),
      //     context: 'row'
      //   }, {
      //     type: CALLBACK_BUTTON,
      //     icon: 'fa fa-fw fa-flag',
      //     label: trans('unflag', {}, 'forum'),
      //     displayed: rows[0].meta.flagged && rows[0].meta.creator.id !== authenticatedUser.id,
      //     callback: () => props.unFlagSubject(rows[0]),
      //     context: 'row'
      //   }, {
      //     type: CALLBACK_BUTTON,
      //     icon: 'fa fa-fw fa-times-circle',
      //     label: trans('close_subject', {}, 'forum'),
      //     callback: () => props.closeSubject(rows[0]),
      //     displayed: !rows[0].meta.closed && (rows[0].meta.creator.id === authenticatedUser.id || props.moderator)
      //   }, {
      //     type: CALLBACK_BUTTON,
      //     icon: 'fa fa-fw fa-check-circle',
      //     label: trans('open_subject', {}, 'forum'),
      //     callback: () => props.unCloseSubject(rows[0]),
      //     displayed: rows[0].meta.closed && (rows[0].meta.creator.id === authenticatedUser.id || props.moderator)
      //   }
      // ]}
      // card={(props) =>
      //   <SubjectCard
      //     {...props}
      //     contentText={props.data.content}
      //   />
      // }
    />
  </div>


export {
  SentMessages
}
