import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {getPlainText} from '#/main/app/data/types/html/utils'
import {LINK_BUTTON} from '#/main/app/buttons'
import {ListData} from '#/main/app/content/list/containers/data'
import {DataCard} from '#/main/app/data/components/card'

const Apps = (props) =>
  <ListData
    name="lti.apps"
    fetch={{
      url: ['apiv2_lti_list'],
      autoload: true
    }}
    primaryAction={(row) => ({
      type: LINK_BUTTON,
      target: `${props.path}/lti/form/${row.id}`
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

    card={(row) =>
      <DataCard
        icon='fa fa-plug'
        title={row.data.title}
        subtitle={row.data.url}
        contentText={getPlainText(row.data.description)}
      />
    }
  />

Apps.propTypes = {
  path: T.string.isRequired
}

export {
  Apps
}
