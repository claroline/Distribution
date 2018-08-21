import React from 'react'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {FormData} from '#/main/app/content/form/containers/data'

const ResourceWidgetForm = (props) =>
  <FormData
    embedded={true}
    level={5}
    name={props.name}
    sections={[
      {
        title: trans('general'),
        primary: true,
        fields: [
          {
            name: 'parameters.resource',
            label: trans('resource'),
            type: 'resource',
            required: true,
            onChange: (selected) => {
              props.updateProp(this.props.name, 'parameters.resource', selected)

              if (props.modal) {
                props.showContentParametersModal(props.workspace)
              }
            }
          }
        ]
      }
    ]}
  />

const ResourceWidgetParameters = connect(
  null,
  (dispatch) => ({
    updateProp(formName, prop, value) {
      dispatch(formActions.updateProp(formName, prop, value))
    },
    showContentParametersModal(workspace) {
      dispatch(modalActions.showModal(MODAL_WORKSPACE_PARAMETERS, {workspace: workspace, workspaceLoading: false}))
    }
  })
)(ResourceWidgetForm)

export {
  ResourceWidgetParameters
}
