import React, {Fragment} from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {ContentLoader} from '#/main/app/content/components/loader'
import {ContentTitle} from '#/main/app/content/components/title'
import {DetailsData} from '#/main/app/content/details/containers/data'

import {Room as RoomTypes} from '#/plugin/booking/prop-types'
import {selectors} from '#/plugin/booking/tools/booking/room/store/selectors'

const RoomDetails = (props) => {
  if (isEmpty(props.room)) {
    return (
      <ContentLoader
        className="row"
        size="lg"
        description={trans('room_loading', {}, 'booking')}
      />
    )
  }
  return (
    <Fragment>
      <ContentTitle
        backAction={{
          type: LINK_BUTTON,
          label: trans('back'),
          target: props.path+'/rooms',
          exact: true
        }}
        title={props.room.name}
        actions={[
          {
            name: 'edit',
            type: LINK_BUTTON,
            icon: 'fa fa-fw fa-pencil',
            label: trans('edit', {}, 'actions'),
            target: props.path+'/rooms/'+props.material.id+'/edit',
            group: trans('management'),
            scope: ['object']
          }
        ]}
      />

      <DetailsData
        name={selectors.FORM_NAME}
        sections={[
          {
            title: trans('general'),
            primary: true,
            fields: [
              {
                name: 'description',
                type: 'html',
                label: trans('description'),
                required: true
              }, {
                name: 'code',
                type: 'string',
                label: trans('code'),
                required: true
              }, {
                name: 'capacity',
                type: 'number',
                label: trans('capacity'),
                required: true,
                options: {
                  min: 0
                }
              }
            ]
          }
        ]}
      />
    </Fragment>
  )
}

RoomDetails.propTypes = {
  path: T.string.isRequired,
  room: T.shape(
    RoomTypes.propTypes
  )
}

export {
  RoomDetails
}
