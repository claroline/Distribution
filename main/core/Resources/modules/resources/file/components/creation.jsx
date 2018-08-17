import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {FormData} from '#/main/app/content/form/containers/data'
import {actions, selectors} from '#/main/core/resource/modals/creation/store'

const FileForm = props =>
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
            onChange: (file) => props.update(props.newNode, file),
            options: {
              //unzippable: true
            }
          }
        ]
      }
    ]}
  />

FileForm.propTypes = {
  newNode: T.shape({
    name: T.string
  }),
  update: T.func.isRequired
}

const FileCreation = connect(
  (state) => ({
    newNode: selectors.newNode(state)
  }),
  (dispatch) => ({
    update(newNode, file) {
      // update resource props
      dispatch(actions.updateResource('size', file.size))
      dispatch(actions.updateResource('hashName', file.url))

      // update node props
      dispatch(actions.updateNode('meta.mimeType', file.mimeType))
      if (!newNode.name) {
        // only set name if none provided
        dispatch(actions.updateNode('name', file.filename))
      }
    }
  })
)(FileForm)

export {
  FileCreation
}
