import React from 'react'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {ListData} from '#/main/app/content/list/containers/data'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'
import {MODAL_CONFIRM} from '#/main/app/modals/confirm'
import {actions as modalActions} from '#/main/app/overlay/modal/store'

import {MessageCard} from '#/plugin/message/data/components/message-card'
import {actions} from '#/plugin/message/actions'


const ReceivedMessagesComponent = (props) =>
  <div>
    <h2>{trans('messages_received')}</h2>
    <ListData
      name="receivedMessages"
      fetch={{
        url: ['apiv2_message_received'],
        autoload: true
      }}
      primaryAction={(message) => ({
        type: LINK_BUTTON,
        target: '/message/'+message.id,
        label: trans('open', {}, 'actions')
      })}
      definition={[
        {
          name: 'object',
          type: 'string',
          label: trans('message_form_object'),
          displayed: true,
          primary: true
        }, {
          name: 'from.username',
          type: 'string',
          label: trans('from_message'),
          displayed: true,
          filterable: false,
          sortable: true
        }, {
          name: 'meta.date',
          type: 'date',
          label: trans('date'),
          displayed: true,
          searchable: true,
          filterable: true,
          option: {
            time: true
          }
        }, {
          name: 'meta.read',
          type: 'boolean',
          label: trans('message_read', {}, 'message'),
          displayed: true,
          searchable: true,
          filterable: true
        }
      ]}
      actions={(rows) => [
        {
          type: LINK_BUTTON,
          icon: 'fa fa-fw fa-eye',
          label: trans('see_message', {}, 'message'),
          target: '/message/'+rows[0].id,
          context: 'row'
        }, {
          type: CALLBACK_BUTTON,
          icon: 'fa fa-fw fa-check',
          label: trans('marked_read_message', {}, 'message'),
          callback: () => props.markReadMessages(rows)
        }, {
          type: LINK_BUTTON,
          icon: 'fa fa-fw fa-share',
          label: trans('reply', {}, 'actions'),
          target: '/message/'+rows[0].id,
          context: 'row'
        }, {
          type: CALLBACK_BUTTON,
          icon: 'fa fa-fw fa-trash-o',
          label: trans('delete'),
          dangerous: true,
          callback: () => props.removeMessages(rows)
        }
      ]}
      // card={(props) =>
      //   <MessageCard
      //     {...props}
      //     contentText={props.data.content}
      //   />
      // }
    />
  </div>

const ReceivedMessages = connect(
  null,
  dispatch => ({
    removeMessages(messages) {
      dispatch(
        modalActions.showModal(MODAL_CONFIRM, {
          title: trans('messages_delete_title'),
          question: trans('messages_confirm_permanent_delete'),
          dangerous: true,
          handleConfirm: () => dispatch(actions.removeMessages(messages))
        })
      )
    },
    markReadMessages(messages) {
      dispatch(actions.markReadMessages(messages))
    }
  })
)(ReceivedMessagesComponent)

export {
  ReceivedMessages
}
