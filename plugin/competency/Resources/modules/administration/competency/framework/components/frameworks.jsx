import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {ListData} from '#/main/app/content/list/containers/data'

const FrameworksComponent = props =>
  <ListData
    name="frameworks.list"
    primaryAction={(row) => ({
      type: 'link',
      label: trans('open'),
      target: `/frameworks/${row.id}`
    })}
    fetch={{
      url: ['apiv2_competency_root_list'],
      autoload: true
    }}
    delete={{
      url: ['apiv2_competency_delete_bulk']
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

FrameworksComponent.propTypes = {
}

const Frameworks = connect(
  (state) => ({
  }),
  (dispatch) => ({
  })
)(FrameworksComponent)

export {
  Frameworks
}
