import React from 'react'
import {connect} from 'react-redux'
import {trans} from '#/main/app/intl/translation'
import {FormData} from '#/main/app/content/form/containers/data'

import {
  actions as formActions,
  selectors as formSelect
} from '#/main/app/content/form/store'

// TODO : add tools
const BadgeFormComponent = (props) => {
  let modelChoice = {}

  if (props.models) {
    props.models.data.forEach(model => {
      modelChoice[model.code] = model.code
    })
  }

  return (
    <FormData
      {...props}
      name="badges.current"
      meta={true}
      buttons={true}
      target={['apiv2_badge-class_create']}
      sections={[
        {
          title: trans('badge'),
          primary: true,
          fields: [
            {
              name: 'name',
              type: 'string',
              label: trans('name'),
              required: true
            },
            {
              name: 'description',
              type: 'string',
              label: trans('description'),
              required: false
            }
          ]
        }
      ]}
    >
      {props.children}
    </FormData>)
}

const BadgeForm = connect(
  (state) => ({
    new: formSelect.isNew(formSelect.form(state, 'badges.current'))
  }),
  (dispatch, ownProps) =>({
    updateProp(propName, propValue) {
      dispatch(formActions.updateProp(ownProps.name, propName, propValue))
    }
  })
)(BadgeFormComponent)

export {
  BadgeForm
}
