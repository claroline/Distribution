import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import omit from 'lodash/omit'

import {trans} from '#/main/core/translation'
import {FormPageActionsContainer} from '#/main/core/data/form/containers/page-actions'
import {actions as formActions} from '#/main/core/data/form/actions'

import {Modal} from '#/main/app/overlay/modal/components/modal'

import {WorkspaceForm} from '#/main/core/workspace/components/form'
import {selectors} from '#/main/core/workspace/parameters/store'
import {actions} from '#/main/app/overlay/alert/store'
import {Workspace as WorkspaceTypes} from '#/main/core/workspace/prop-types'

/*<FormPageActionsContainer
formName={selectors.STORE_NAME}
target={(workspace) => ['apiv2_workspace_update', {id: props.workspace.id}]}
opened={true}
  />

 onEntering={() => props.loadWorkspace(props.workspace)}

<WorkspaceForm name={selectors.STORE_NAME} />*/

const ParametersModalComponent = props => {
  props.loadWorkspace(props.workspace)

  return (
    <Modal
      {...omit(props, 'workspace', 'loadWorkspace')}
      title={trans('parameters', {}, 'tools')}

    >
      coucou
    </Modal>
  )
}

ParametersModalComponent.propTypes = {
  workspace: T.shape(
    WorkspaceTypes.propTypes
  ).isRequired,
  loadWorkspace: T.func.isRequired
}

const ParametersModal = connect(
  null,
  (dispatch) => ({
    loadWorkspace(workspace) {
      //console.log(workspace)
      dispatch(actions.addAlert('1223', 'pending', 'generic'))


      //dispatch(formActions.resetForm(selectors.STORE_NAME, workspace))
    }
  })
)(ParametersModalComponent)

export {
  ParametersModal
}
