import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {Routes} from '#/main/app/router'
import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions'

import {Workspace}  from '#/main/core/administration/workspace/workspace/components/workspace'
import {CreationForm as WorkspaceCreation} from '#/main/core/workspace/creation/components/creation'
import {Workspaces} from '#/main/core/administration/workspace/workspace/components/workspaces'
import {actions}    from '#/main/core/administration/workspace/workspace/actions'

const WorkspaceTabActions = () =>
  <PageActions>
    <PageAction
      type="link"
      icon="fa fa-plus"
      label={trans('add_workspace')}
      target="/workspaces/creation/form"
      primary={true}
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
        path: '/workspaces/form/:id',
        component: Workspace,
        onEnter: (params) => props.openForm(params.id)
      }, {
        path: '/workspaces/creation/form',
        component: WorkspaceCreation,
        onEnter: () => props.openForm()
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
