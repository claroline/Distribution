import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {FormData} from '#/main/app/content/form/containers/data'
import {selectors} from '#/plugin/web-resource/resources/web-resource/editor/store/selectors'
import {actions as formActions} from '#/main/app/content/form/store'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'

const WebResourceForm = props =>
  <FormData
    level={5}
    name={selectors.FORM_NAME}
    buttons={true}
    save={{
      type: CALLBACK_BUTTON,
      callback: () => props.saveForm(props.node)
    }}
    cancel={{
      type: LINK_BUTTON,
      target: '/',
      exact: true
    }}
    sections={[
      {
        title: trans('general'),
        primary: true,
        fields: [
          {
            name: 'file',
            label: trans('file'),
            type: 'file',
            help: trans('has_to_be_a_zip', {}, 'resource'),
            required: true,
            onChange: (data) => props.update(data),
            options: {
              uploadUrl: ['apiv2_webresource_file_upload', {workspace: props.workspaceId}]
            }
          }
        ]
      }
    ]}
  />


WebResourceForm.propTypes = {
  update: T.func.isRequired,
  workspaceId: T.string.isRequired,
  node: T.object.isRequired,
  saveForm: T.func.isRequired
}

const WebResourceEdit = connect(
  state => ({
    workspaceId: state.resourceNode.workspace.id,
    node: state.resourceNode
  }),
  (dispatch) => ({
    update(data) {
      // update resource props
      dispatch(formActions.updateProp(selectors.STORE_NAME, 'size', data.size))
      dispatch(formActions.updateProp(selectors.STORE_NAME, 'hashName', data.hashName))

    },
    saveForm(node) {
      dispatch(formActions.saveForm(selectors.FORM_NAME, ['claro_resource_action_short', {action: 'change_file', id: node.id}]))
    }
  })
)(WebResourceForm)

export {
  WebResourceEdit as Editor
}
