import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {ListData} from '#/main/app/content/list/containers/data'

import {selectors} from '#/plugin/booking/tools/booking/material/store'
import {MaterialCard} from '#/plugin/booking/tools/booking/material/components/card'

const MaterialList = (props) =>
  <ListData
    name={selectors.LIST_NAME}
    fetch={{
      url: ['apiv2_booking_material_list'],
      autoload: true
    }}
    delete={{
      url: ['apiv2_booking_material_delete_bulk']
    }}
    definition={[
      {
        name: 'code',
        type: 'string',
        label: trans('code')
      }, {
        name: 'name',
        label: trans('name'),
        displayed: true
      }, {
        name: 'quantity',
        type: 'number',
        label: trans('quantity'),
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
      target: props.path+'/materials/'+row.id
    })}
    actions={(rows) => [
      {
        name: 'edit',
        type: LINK_BUTTON,
        icon: 'fa fa-fw fa-pencil',
        label: trans('edit', {}, 'actions'),
        target: props.path+'/materials/'+rows[0].id+'/edit',
        group: trans('management'),
        scope: ['object']
      }
    ]}
    card={MaterialCard}
  />

MaterialList.propTypes = {
  path: T.string.isRequired
}

export {
  MaterialList
}
