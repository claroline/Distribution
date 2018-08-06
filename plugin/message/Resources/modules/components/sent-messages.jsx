import React from 'react'

import {trans} from '#/main/core/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {ListData} from '#/main/app/content/list/containers/data'

import {MessageCard} from '#/plugin/message/data/components/message-card'


const SentMessages = () =>
  <div>
    <ListData
      name="sentMessages"
      fetch={{
        url: ['apiv2_message_sent'],
        autoload: true
      }}
      delete={{
        url: ['apiv2_message_user_remove']
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
          name: 'object',
          type: 'string',
          label: trans('message_form_object'),
          displayed: true,
          primary: true
        }, {
          name: 'to',
          type: 'string',
          label: trans('to_message'),
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
        }
      ]}
      // actions={(rows) => [
      //   {
      //     type: LINK_BUTTON,
      //     icon: 'fa fa-fw fa-eye',
      //     label: trans('see_message', {}, 'message'),
      //     target: '/message/'+rows[0].id,
      //     context: 'row'
      //   }
      // ]}
      // card={(props) =>
      //   <MessageCard
      //     {...props}
      //     contentText={props.data.content}
      //   />
      // }
    />
  </div>


export {
  SentMessages
}
