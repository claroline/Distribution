import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {selectors as formSelect} from '#/main/app/content/form/store/selectors'
import {FormData} from '#/main/app/content/form/containers/data'

const FrameworkFormComponent = (props) =>
  <FormData
    level={3}
    name="frameworks.form"
    buttons={true}
    target={(competency, isNew) => isNew ?
      ['apiv2_competency_create'] :
      ['apiv2_competency_update', {id: competency.id}]
    }
    cancel={{
      type: LINK_BUTTON,
      target: '/frameworks',
      exact: true
    }}
    sections={[
      {
        title: trans('general'),
        primary: true,
        fields: [
          {
            name: 'name',
            type: 'string',
            label: trans('name'),
            required: true
          }, {
            name: 'description',
            type: 'html',
            label: trans('description')
          }, {
            name: 'scale',
            type: 'competency_scale',
            label: trans('scale', {}, 'competency'),
            required: true
          }
        ]
      }
    ]}
  />

FrameworkFormComponent.propTypes = {
  new: T.bool.isRequired
}

const FrameworkForm = connect(
  state => ({
    new: formSelect.isNew(formSelect.form(state, 'frameworks.form'))
  })
)(FrameworkFormComponent)

export {
  FrameworkForm
}
