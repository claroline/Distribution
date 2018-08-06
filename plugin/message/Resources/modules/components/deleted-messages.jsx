import React from 'react'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'
import {ListData} from '#/main/app/content/list/containers/data'

import {MessageCard} from '#/plugin/message/data/components/message-card'

const DeletedMessages = () =>
  <div>
    <h2>{trans('messages_delete')}</h2>
    <ListData
      name="messagesDeleted"
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
          label: trans('from_message'),
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
      actions={(rows) => [
        {
          type: LINK_BUTTON,
          icon: 'fa fa-fw fa-eye',
          label: trans('see_message', {}, 'message'),
          target: '/message/'+rows[0].id,
          context: 'row'
        }
      ]}
      card={(props) =>
        <MessageCard
          {...props}
          contentText={props.data.content}
        />
      }
    />
  </div>


export {
  DeletedMessages
}
