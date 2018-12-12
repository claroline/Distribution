import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {Button} from '#/main/app/action/components/button'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {Modal} from '#/main/app/overlay/modal/components/modal'

import {Workspace as WorkspaceTypes} from '#/main/core/workspace/prop-types'

const EvidenceModal = props =>
  <Modal
    {...props}
    icon="fa fa-fw fa-cog"
    title={trans('parameters')}
    subtitle={props.workspace.name}
  >
    <div>
      add form here
    </div>

    <Button
      className="modal-btn btn btn-primary"
      type={CALLBACK_BUTTON}
      primary={true}
      label={trans('save', {}, 'actions')}
      disabled={!props.saveEnabled}
      callback={() => {
        props.saveEvidence(props.workspace)
        props.fadeModal()
      }}
    />
  </Modal>

EvidenceModal.propTypes = {
  workspace: T.shape(
    WorkspaceTypes.propTypes
  ).isRequired,
  saveEnabled: T.bool.isRequired,
  saveEvidence: T.func.isRequired,
  fadeModal: T.func.isRequired
}

export {
  EvidenceModal
}
