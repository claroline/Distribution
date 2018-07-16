import React from 'react'
import {PageContainer, PageHeader} from '#/main/core/layout/page/index'
import {FormStepper} from '#/main/core/layout/form/components/form-stepper.jsx'
import {trans} from '#/main/core/translation'
import {connect} from 'react-redux'

import {actions as formActions} from '#/main/core/data/form/actions'
import {Workspace as WorkspaceTypes} from '#/main/core/workspace/prop-types'
import {actions} from '#/main/core/workspace/creation/store/actions'
import {select as formSelect} from '#/main/core/data/form/selectors'

import {WorkspaceForm} from '#/main/core/workspace/creation/components/form.jsx'
import {WorkspaceHome} from '#/main/core/workspace/creation/components/home.jsx'
import {WorkspaceResources} from '#/main/core/workspace/creation/components/resources.jsx'
import {WorkspaceRoles} from '#/main/core/workspace/creation/components/roles.jsx'
import {WorkspaceRoot} from '#/main/core/workspace/creation/components/root.jsx'
import {WorkspaceTools} from '#/main/core/workspace/creation/components/tools.jsx'

const CreationForm = props => {

  let steps = [
    {
      path: '/workspaces/creation/form',
      title: 'form',
      component: WorkspaceForm,
      onEnter: props.createForm,
      onLeave: () => props.build(props.workspace.model)
    },
    {
      path: '/workspaces/creation/roles',
      title: 'roles',
      component: WorkspaceRoles,
      onLeave: () => props.copyRoles(props.workspace, props.model)
    },
    {
      path: '/workspaces/creation/tools',
      title: 'tools',
      component: WorkspaceTools,
      onLeave: () => props.copyRoles(props.workspace, props.model)
    },
    {
      path: '/workspaces/creation/root',
      title: 'root',
      component: WorkspaceRoot,
      onLeave: () => console.log('buildRoot')
    },
    {
      path: '/workspaces/creation/resources',
      title: 'resources',
      component: WorkspaceResources,
      onLeave: () => props.copyResources(props.workspace, props.model)
    },
    {
      path: '/workspaces/creation/home',
      title: 'home',
      component: WorkspaceHome,
      onLeave: () => props.copyHome(props.workspace, props.model)
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
      console.log('createForm')
      dispatch(formActions.resetForm('workspaces.creation.workspace', WorkspaceTypes.defaultProps, true))
    },
    build(model) {
      console.log('build')
      //dispatch(actions.copyBase(model))
      //dispatch(actions.fetchModel(model))
    },
    copyRoles(workspace, model) {
      //dispatch(actions.copyRoles(workspace, model))
    },
    copyBaseTools(workspace, model) {
      //dispatch(actions.copyBaseTools(workspace, model))
    },
    copyHome(workspace, model) {
      //dispatch(actions.copyHome(workspace, model))
    },
    copyResources(workspace, model) {
      //dispatch(actions.copyResources(workspace, model))
    }
  })
)(CreationForm)



export {ConnectedCreationForm as CreationForm}
