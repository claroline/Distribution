import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import omit from 'lodash/omit'

import {trans} from '#/main/core/translation'
import {Button} from '#/main/app/action/components/button'
import {Modal} from '#/main/app/overlay/modal/components/modal'

import {actions, selectors} from '#/main/core/resource/modals/creation/store'
import {ResourceNode as ResourceNodeTypes} from '#/main/core/resource/prop-types'
import {ResourceForm} from '#/main/core/resource/components/form'

const ParametersModalComponent = props =>
  <Modal
    {...omit(props, 'saveEnabled', 'save', 'parent')}
    icon="fa fa-fw fa-plus"
    title={trans('create_resource')}
    subtitle="2. Configurez la ressource"
  >
    <ResourceForm name={selectors.FORM_NAME} dataPart="node" />

    <Button
      className="modal-btn btn btn-primary"
      type="callback"
      primary={true}
      label={trans('create', {}, 'actions')}
      disabled={!props.saveEnabled}
      callback={() => {
        props.save(props.parent)
        props.fadeModal()
      }}
    />
  </Modal>

ParametersModalComponent.propTypes = {
  parent: T.shape(
    ResourceNodeTypes.propTypes
  ).isRequired,
  saveEnabled: T.bool.isRequired,
  save: T.func.isRequired,
  fadeModal: T.func.isRequired
}

const ParametersModal = connect(
  (state) => ({
    parent: selectors.parent(state),
    saveEnabled: selectors.saveEnabled(state)
  }),
  (dispatch) => ({
    save(parent) {
      dispatch(actions.create(parent))
    }
  })
)(ParametersModalComponent)

export {
  ParametersModal
}
