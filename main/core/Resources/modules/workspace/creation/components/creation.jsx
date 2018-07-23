import React from 'react'
import {PageContainer, PageHeader} from '#/main/core/layout/page/index'
import {trans} from '#/main/core/translation'
import {connect} from 'react-redux'

import {actions as formActions} from '#/main/core/data/form/actions'
import {Workspace as WorkspaceTypes} from '#/main/core/workspace/prop-types'
import {select as formSelect} from '#/main/core/data/form/selectors'

import {WorkspaceForm} from '#/main/core/workspace/creation/components/form.jsx'
import {Routes} from '#/main/app/router'

const CreationForm = props => {

  let steps = [
    {
      path: '/workspaces/creation/form',
      title: 'form',
      component: WorkspaceForm,
      onEnter: props.createForm
    }
  ]

  return (
    <PageContainer id="workspace-creation">
      <PageHeader key="header"/>
      <Routes routes={steps}/>

    </PageContainer>
  )
}

const ConnectedCreationForm = connect(
  state => {
    const workspace = formSelect.data(formSelect.form(state, 'workspaces.current'))

    return {
      workspace: workspace,//?
      model: state.model
    }
  },
  dispatch =>({
    createForm() {
      dispatch(formActions.resetForm('workspaces.current', WorkspaceTypes.defaultProps, true))
    }
  })
)(CreationForm)

export {ConnectedCreationForm as CreationForm}
