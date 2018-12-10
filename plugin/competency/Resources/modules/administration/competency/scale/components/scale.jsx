import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {selectors as formSelect} from '#/main/app/content/form/store/selectors'
import {FormData} from '#/main/app/content/form/containers/data'

const ScaleComponent = (props) =>
  <FormData
    level={3}
    name="scales.current"
    buttons={true}
    target={(scale, isNew) => isNew ?
      ['apiv2_competency_scale_create'] :
      ['apiv2_competency_scale_update', {id: scale.id}]
    }
    cancel={{
      type: LINK_BUTTON,
      target: '/scales',
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
            name: 'levels',
            type: 'enum',
            label: trans('levels', {}, 'competency'),
            options: {
              placeholder: trans('level.none', {}, 'competency'),
              addButtonLabel: trans('level.add', {}, 'competency'),
              unique: true
            },
            required: true
          }
        ]
      }
    ]}
  />

ScaleComponent.propTypes = {
  new: T.bool.isRequired
}

const Scale = connect(
  state => ({
    new: formSelect.isNew(formSelect.form(state, 'scales.current'))
  })
)(ScaleComponent)

export {
  Scale
}
