import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {Routes} from '#/main/app/router'
import {ToolPage} from '#/main/core/tool/containers/page'

import {RoomList} from '#/plugin/booking/tools/booking/room/components/list'
import {RoomForm} from '#/plugin/booking/tools/booking/room/containers/form'
import {RoomDetails} from '#/plugin/booking/tools/booking/room/containers/details'

const RoomMain = (props) =>
  <ToolPage
    subtitle={trans('rooms', {}, 'booking')}
    primaryAction="add"
    actions={[
      {
        name: 'add',
        type: LINK_BUTTON,
        icon: 'fa fa-fw fa-plus',
        label: trans('add_room', {}, 'booking'),
        target: props.path+'/rooms/new',
        primary: true,
        displayed: props.editable
      }
    ]}
  >
    <Routes
      path={props.path+'/rooms'}
      routes={[
        {
          path: '/',
          exact: true,
          render() {
            return (
              <RoomList
                path={props.path}
              />
            )
          }
        }, {
          path: '/new',
          onEnter: () => props.open(),
          component: RoomForm,
          disabled: !props.editable
        }, {
          path: '/:id',
          exact: true,
          onEnter: (params = {}) => props.open(params.id),
          component: RoomDetails
        }, {
          path: '/:id/edit',
          onEnter: (params = {}) => props.open(params.id),
          component: RoomForm,
          disabled: !props.editable
        }
      ]}
    />
  </ToolPage>

RoomMain.propTypes = {
  path: T.string.isRequired,
  open: T.func.isRequired,
  editable: T.bool.isRequired
}

export {
  RoomMain
}
