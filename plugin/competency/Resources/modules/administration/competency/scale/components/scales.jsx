import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {ListData} from '#/main/app/content/list/containers/data'

const Scales = () =>
  <ListData
    name="scales.list"
    primaryAction={(row) => ({
      type: 'link',
      label: trans('open'),
      target: `/scales/form/${row.id}`
    })}
    fetch={{
      url: ['apiv2_competency_scale_list'],
      autoload: true
    }}
    actions={(rows) => [
      {
        type: LINK_BUTTON,
        icon: 'fa fa-fw fa-pencil',
        label: trans('edit'),
        scope: ['object'],
        target: `/scales/form/${rows[0].id}`
      }
    ]}
    delete={{
      url: ['apiv2_competency_scale_delete_bulk']
    }}
    definition={[
      {
        name: 'name',
        label: trans('name'),
        displayed: true,
        filterable: true,
        type: 'string',
        primary: true
      }
    ]}
  />

export {
  Scales
}
