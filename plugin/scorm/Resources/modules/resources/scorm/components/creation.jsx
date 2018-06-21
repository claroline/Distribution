import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {FormContainer} from '#/main/core/data/form/containers/form'
import {actions, selectors} from '#/main/core/resource/modals/creation/store'

const ScormForm = props =>
  <FormContainer
    level={5}
    name={selectors.FORM_NAME}
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

            onChange: (file) => props.update(props.newNode, file),
            options: {
              // uploadUrl: ['apiv2_transfer_upload_file'],
              unzippable: true
            }
          }
        ]
      }
    ]}
  />

ScormForm.propTypes = {
  newNode: T.shape({
    name: T.string
  }),
  update: T.func.isRequired
}

const ScormCreation = connect(
  null,
  (dispatch) => ({
    update(newNode, file) {
      console.log(file)
      // update resource props
      // dispatch(actions.updateResource('size', file.size))
      // dispatch(actions.updateResource('hashName', file.url))
      //
      // // update node props
      // dispatch(actions.updateNode('meta.mimeType', file.mimeType))
      // if (!newNode.name) {
      //   // only set name if none provided
      //   dispatch(actions.updateNode('name', file.filename))
      // }
    }
  })
)(ScormForm)

export {
  ScormCreation
}
