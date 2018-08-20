import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {FormData} from '#/main/app/content/form/containers/data'
import {actions, selectors} from '#/main/core/resource/modals/creation/store'

// TODO : should reuse the standard file resource creation

const ScormForm = props =>
  <FormData
    level={5}
    name={selectors.STORE_NAME}
    dataPart={selectors.FORM_RESOURCE_PART}
    sections={[
      {
        title: trans('general'),
        primary: true,
        fields: [
          {
            name: 'file',
            label: trans('file'),
            type: 'file',
            required: true,
            onChange: (data) => props.update(data),
            options: {
              uploadUrl: ['apiv2_scorm_archive_upload', {workspace: props.workspaceId}]
            }
          }
        ]
      }
    ]}
  />

ScormForm.propTypes = {
  workspaceId: T.string.isRequired,
  update: T.func.isRequired
}

const ScormCreation = connect(
  state => ({
    workspaceId: selectors.newNode(state).workspace.id
  }),
  (dispatch) => ({
    update(data) {
      dispatch(actions.updateResource('hashName', data.hashName))
      dispatch(actions.updateResource('version', data.version))
      dispatch(actions.updateResource('scos', data.scos))
    }
  })
)(ScormForm)

export {
  ScormCreation
}
