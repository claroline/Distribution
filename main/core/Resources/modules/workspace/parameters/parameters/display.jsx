import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'

import {FormContainer} from '#/main/core/data/form/containers/form.jsx'
import {select as formSelect} from '#/main/core/data/form/selectors'


import {PageActions} from '#/main/core/layout/page/components/page-actions.jsx'
import {FormPageActionsContainer} from '#/main/core/data/form/containers/page-actions.jsx'


const Actions = () =>
  <PageActions>
    <FormPageActionsContainer
      formName="parameters"
      target={(workspace) => ['apiv2_workspace_update', {id: workspace.id}]}
      opened={true}
      cancel={{

      }}
    />
  </PageActions>

Actions.propTypes = {
  location: T.shape({
    pathname: T.string
  }).isRequired
}

const Tab = () => {
  return (
    <div>
      <FormContainer
        level={3}
        name="parameters"
        sections={[
          {
            id: 'display',
            title: trans('general'),
            primary: true,
            fields: [
              {
                name: 'options.hide_tools_menu',
                type: 'boolean',
                label: trans('hide_tools_menu'),
                required: false
              },
              {
                name: 'options.background_color',
                type: 'color',
                label: trans('background_color'),
                required: false
              },
              {
                name: 'options.hide_breadcrumb',
                type: 'boolean',
                label: trans('hide_breadcrumb'),
                required: false
              },
              {
                name: 'options.use_workspace_opening_resource',
                type: 'boolean',
                label: trans('use_workspace_opening_resource'),
                required: false
              },
              {
                name: 'options.workspace_opening_resource',
                type: 'resource',
                label: trans('workspace_opening_resource'),
                required: false
              }
            ]
          }
        ]}
      />
    </div>
  )
}

Tab.propTypes = {
  workspace: T.shape({
  }).isRequired
}

const ConnectedTab = connect(
  state => ({
    workspace: formSelect.data(formSelect.form(state, 'parameters'))
  }),
  null
)(Tab)

export {
  ConnectedTab as DisplayTab,
  Actions as DisplayActions
}
