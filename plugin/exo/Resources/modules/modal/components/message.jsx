import React, {Component, PropTypes as T} from 'react'
import Modal from 'react-bootstrap/lib/Modal'
import {t} from './../../utils/translate'
import {BaseModal} from './base.jsx'

export const MessageModal = props =>
  <BaseModal {...props}>
    <Modal.Body>
      {props.message}
    </Modal.Body>
    <Modal.Footer>
      <button
        className="btn-primary"
        onClick={() => props.fadeModal()}
      >
        {t('Ok')}
      </button>
    </Modal.Footer>
  </BaseModal>

MessageModal.propTypes = {
  message: T.string.isRequired
}
