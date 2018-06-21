import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {FormContainer} from '#/main/core/data/form/containers/form'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {actions as creationActions, selectors} from '#/main/core/resource/modals/creation/store'
import {actions} from '#/plugin/web-resource/resources/web-resource/actions'

const WebResourceForm = props => {

  return (
    <div>
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
                options: {
                  uploadUrl: ['apiv2_webresource_file_upload']
                },
                help: trans('not_a_zip', {}, 'resource'),
                required: true,
                onChange: (file) => props.update(props.newNode, file)
              }
            ]
          }
        ]}
      />

    </div>

  )
}



WebResourceForm.propTypes = {
  newNode: T.shape({
    name: T.string
  }),
  update: T.func.isRequired
}

const WebResourceCreation = connect(
  state => ({
    formCreation: formSelect.data(formSelect.form(state, 'resourceCreation.form'))
  }),
  (dispatch) => ({
    verifyFile(file) {
      dispatch(actions.verifyFile(file))
    },
    update(newNode, file) {
      // update resource props
      dispatch(creationActions.updateResource('size', file.size))
      dispatch(creationActions.updateResource('hashName', file.url))

      // update node props
      dispatch(creationActions.updateNode('meta.mimeType', file.mimeType))
      if (!newNode.name) {
        // only set name if none provided
        dispatch(creationActions.updateNode('name', file.filename))
      }
    }
  })
)(WebResourceForm)

export {
  WebResourceCreation
}
