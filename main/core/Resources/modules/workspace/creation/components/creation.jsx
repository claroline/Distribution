import React from 'react'
import {PageContainer, PageHeader} from '#/main/core/layout/page/index'
import {FormStepper} from '#/main/core/layout/form/components/form-stepper.jsx'
import {trans} from '#/main/core/translation'
import {connect} from 'react-redux'

import {actions as formActions} from '#/main/core/data/form/actions'
import {Workspace as WorkspaceTypes} from '#/main/core/workspace/prop-types'
import {actions} from '#/main/core/workspace/creation/store/actions'

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
      onEnter: props.createForm(),
      onLeave: props.loadModel(props.data)
    },
    {
      path: '/workspaces/creation/roles',
      title: 'roles',onLeave
      component: WorkspaceRoles
    },
    {
      path: '/workspaces/creation/tools',
      title: 'tools',
      component: WorkspaceTools
    },
    {
      path: '/workspaces/creation/root',
      title: 'root',
      component: WorkspaceRoot
    },
    {
      path: '/workspaces/creation/resources',
      title: 'resources',
      component: WorkspaceResources
    },
    {
      path: '/workspaces/creation/home',
      title: 'home',
      component: WorkspaceHome
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
    return {
      const workspace = formSelect.data(formSelect.form(state, 'workspaces.creation.workspace'))

      return {
        workspace: workspace
      }
    }
  },
  dispatch =>({
    createForm() {
      dispatch(formActions.resetForm('workspaces.creation.workspace', WorkspaceTypes.defaultProps, true))
    },
    loadModel() {
      dispatch()
    }
  })
)(CreationForm)



export {ConnectedCreationForm as CreationForm}
