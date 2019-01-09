import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {ListData} from '#/main/app/content/list/containers/data'

const Apps = () =>
  <ListData
    name="apps"
    fetch={{
      url: ['apiv2_lti_list'],
      autoload: true
    }}
    primaryAction={(row) => ({
      type: LINK_BUTTON,
      target: `/form/${row.id}`
    })}
    delete={{
      url: ['apiv2_lti_delete_bulk']
    }}
    definition={[
      {
        name: 'title',
        label: trans('title'),
        type: 'string',
        primary: true,
        displayed: true
      }, {
        name: 'url',
        label: trans('url', {}, 'lti'),
        type: 'string',
        displayed: true
      }, {
        name: 'description',
        label: trans('description'),
        type: 'html',
        displayed: true
      }
    ]}

    // card={ScheduledTaskCard}
  />

export {
  Apps
}
