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
*/

const ParametersModalComponent = props =>
  <Modal
    {...omit(props, 'workspace', 'loadWorkspace')}
    icon="fa fa-fw fa-cog"
    title={trans('parameters')}
    subtitle={props.workspace.name}
    onEntering={() => props.loadWorkspace(props.workspace)}
  >
    <WorkspaceForm name={selectors.STORE_NAME} />
  </Modal>

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
      dispatch(formActions.resetForm(selectors.STORE_NAME, workspace))
    }
  })
)(ParametersModalComponent)

export {
  ParametersModal
}
