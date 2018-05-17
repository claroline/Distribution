import React from 'react'

import {trans} from '#/main/core/translation'
import {FormPageActionsContainer} from '#/main/core/data/form/containers/page-actions'

import {Modal} from '#/main/app/overlay/modal/components/modal'
import {WorkspaceForm} from '#/main/core/workspace/components/form'

const ParametersModal = () =>
  <Modal
    title={trans('parameters', {}, 'tools')}
  >
    <FormPageActionsContainer
      formName="parameters"
      target={(workspace) => ['apiv2_workspace_update', {id: workspace.id}]}
      opened={true}
    />

    <WorkspaceForm name="parameters" />
  </Modal>

export {
  ParametersModal
}
