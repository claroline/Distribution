import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {Routes} from '#/main/app/router'
import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions'

import {FormPageActionsContainer} from '#/main/core/data/form/containers/page-actions.jsx'
import {WorkspaceCreation} from '#/main/core/workspace/creation/containers/creation.jsx'

import {Workspace}  from '#/main/core/administration/workspace/workspace/components/workspace.jsx'
import {Workspaces} from '#/main/core/administration/workspace/workspace/components/workspaces.jsx'
import {actions}    from '#/main/core/administration/workspace/workspace/actions'

const WorkspaceTabActions = () =>
  <PageActions>
    <FormPageActionsContainer
      formName="workspaces.current"
      target={(workspace, isNew) => isNew ?
        ['apiv2_workspace_create'] :
        ['apiv2_workspace_update', {id: workspace.id}]
      }
      opened={!!matchPath(props.location.pathname, {path: '/workspaces/form'})}
      open={{
        type: 'link',
        icon: 'fa fa-plus',
        label: t('add_workspace'),
        target: '/workspaces/creation'
      }}
      cancel={{
        type: 'link',
        target: '/workspaces',
        exact: true
      }}
    />
  </PageActions>

const WorkspaceTabComponent = props =>
  <Routes
    routes={[
      {
        path: '/workspaces',
        exact: true,
        component: Workspaces
      }, {
        path: '/workspaces/creation',
        component: WorkspaceCreation
        //exact: true,
      }, {
        path: '/workspaces/form/:id',
        exact: true,
        component: Workspace,
        onEnter: (params) => {
          props.openForm(params.id || null)
        }
      }
    ]}
  />

WorkspaceTabComponent.propTypes = {
  openForm: T.func.isRequired
}

const WorkspaceTab = connect(
  null,
  dispatch => ({
    openForm(id = null) {
      dispatch(actions.open('workspaces.current', id))
    }
  })
)(WorkspaceTabComponent)

export {
  WorkspaceTab,
  WorkspaceTabActions
}
