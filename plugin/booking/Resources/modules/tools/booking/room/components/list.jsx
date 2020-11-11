import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {ListData} from '#/main/app/content/list/containers/data'

import {selectors} from '#/plugin/booking/tools/booking/room/store'
import {RoomCard} from '#/plugin/booking/tools/booking/room/components/card'

const RoomList = (props) =>
  <ListData
    name={selectors.LIST_NAME}
    fetch={{
      url: ['apiv2_booking_room_list'],
      autoload: true
    }}
    delete={{
      url: ['apiv2_booking_room_delete_bulk']
    }}
    definition={[
      {
        name: 'code',
        type: 'string',
        label: trans('code')
      }, {
        name: 'name',
        type: 'string',
        label: trans('name'),
        displayed: true
      }, {
        name: 'capacity',
        type: 'number',
        label: trans('capacity'),
        displayed: true
      }, {
        name: 'description',
        type: 'html',
        label: trans('description')
      }
    ]}
    primaryAction={(row) => ({
      type: LINK_BUTTON,
      label: trans('open', {}, 'actions'),
      target: props.path+'/rooms/'+row.id
    })}
    actions={(rows) => [
      {
        name: 'edit',
        type: LINK_BUTTON,
        icon: 'fa fa-fw fa-pencil',
        label: trans('edit', {}, 'actions'),
        target: props.path+'/rooms/'+rows[0].id+'/edit',
        group: trans('management'),
        scope: ['object']
      }
    ]}
    card={RoomCard}
  />

export {
  RoomList
}
