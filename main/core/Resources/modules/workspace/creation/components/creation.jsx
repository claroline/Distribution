import React from 'react'
import {PageContainer, PageHeader} from '#/main/core/layout/page/index'
import {FormStepper} from '#/main/core/layout/form/components/form-stepper.jsx'
import {trans} from '#/main/core/translation'
import {connect} from 'react-redux'

import {actions as formActions} from '#/main/core/data/form/actions'
import {Workspace as WorkspaceTypes} from '#/main/core/workspace/prop-types'
import {actions} from '#/main/core/workspace/creation/store/actions'
import {actions as logActions} from '#/main/core/workspace/creation/components/log/actions'
import {select as formSelect} from '#/main/core/data/form/selectors'

import {WorkspaceForm} from '#/main/core/workspace/creation/components/form.jsx'
import {WorkspaceHome} from '#/main/core/workspace/creation/components/home.jsx'
import {WorkspaceResources} from '#/main/core/workspace/creation/components/resources.jsx'
import {WorkspaceRoles} from '#/main/core/workspace/creation/components/roles.jsx'
import {WorkspaceTools} from '#/main/core/workspace/creation/components/tools.jsx'

/*
callback: () => {
  const logName = this.getLogId()
  const refresher = setInterval(() => {
    this.props.loadLog(logName)
    if (this.props.logs && this.props.logs.total !== undefined && this.props.logs.processed === this.props.logs.total) {
      clearInterval(refresher)
    }
  }, 2000)

  this.generateLogId()
}*/

const CreationForm = props => {

  let steps = [
    {
      path: '/workspaces/creation/form',
      title: 'form',
      component: WorkspaceForm,
      onEnter: props.createForm,
      onLeave: () => props.build(props.workspace.model, props.workspace)
    }, {
      path: '/workspaces/creation/roles',
      title: 'roles',
      component: WorkspaceRoles,
      onLeave: () => props.copyRoles(props.workspace, props.workspace.model)
    }, {
      path: '/workspaces/creation/tools',
      title: 'tools',
      component: WorkspaceTools,
      onLeave: () => props.copyBaseTools(props.workspace, props.workspace.model)
    }, {
      path: '/workspaces/creation/resources',
      title: 'resources',
      component: WorkspaceResources,
      onLeave: () => props.copyResources(props.workspace, props.workspace.model)
    }, {
      path: '/workspaces/creation/home',
      title: 'home',
      component: WorkspaceHome,
      onLeave: () => props.copyHome(props.workspace, props.workspace.model)
    }, {
      path: '/workspaces/creation/end',
      title: 'end',
      component: <div>end</div>
    }
  ]

  return (
    <PageContainer id="workspace-creation">
      <PageHeader
        key="header"
        title={trans('workspace_creation')}
      />
      <FormStepper
        key="form"
        className="page-content"
        submit={{
          icon: 'fa fa-book',
          label: trans('end', {}, 'platform'),
          action: () => alert('done')
        }}
        steps={steps}
        redirect={[
          {from: '/workspaces/creation', exact: true, to: '/workspaces/creation/form'}
        ]}
      />
    </PageContainer>
  )
}

const ConnectedCreationForm = connect(
  state => {
    const workspace = formSelect.data(formSelect.form(state, 'workspaces.creation.workspace'))

    return {
      workspace: workspace,//?
      model: state.model
    }
  },
  dispatch =>({
    createForm() {
      dispatch(formActions.resetForm('workspaces.creation.workspace', WorkspaceTypes.defaultProps, true))
    },
    build(model, workspace) {
      dispatch(actions.copyBase(model, workspace))
      dispatch(actions.fetchModel(model))
    },
    copyRoles(workspace, model) {
      dispatch(actions.copyRoles(workspace, model))
      dispatch(logActions.load(workspace.id))
    },
    copyBaseTools(workspace, model) {
      dispatch(actions.copyBaseTools(workspace, model))
      dispatch(logActions.load(workspace.id))
    },
    copyHome(workspace, model) {
      dispatch(actions.copyHome(workspace, model))
      dispatch(logActions.load(workspace.id))
    },
    copyResources(workspace, model) {
      dispatch(actions.copyResources(workspace, model))
      dispatch(logActions.load(workspace.id))
    }
  })
)(CreationForm)



export {ConnectedCreationForm as CreationForm}
