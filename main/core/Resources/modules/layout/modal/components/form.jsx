import React from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'

import Modal from 'react-bootstrap/lib/Modal'

import {t} from '#/main/core/translation'
import {BaseModal} from './base.jsx'
import {Form} from '#/main/core/data/form/components/form.jsx'

const FormModal = props =>
  <BaseModal {...props}>
    <Modal.Body>
      {/* primary section */}
    </Modal.Body>

    {/* other sections */}

    <button
      className="modal-btn btn btn-primary"
      disabled={!this.state.pendingChanges || (this.state.validating && !isEmpty(this.state.errors))}
      onClick={() => {
        // todo validate

        props.save()
        props.fadeModal()
      }}
    >
      {t('save')}
    </button>
  </BaseModal>

FormModal.propTypes = {
  save: T.func.isRequired,
  fadeModal: T.func.isRequired
}

export {
  FormModal
}
