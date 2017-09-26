import React from 'react'
import {PropTypes as T} from 'prop-types'
import Modal from 'react-bootstrap/lib/Modal'
import classes from 'classnames'

import {t} from '#/main/core/translation'
import {BaseModal} from './base.jsx'
import {Form} from '#/main/core/layout/form/components/form.jsx'

const FormModal = props => {
  return (
    <BaseModal {...props}>
      <Modal.Body>
        {React.createElement(
          Form,
          {definition: props.definition, item: props.item, onSubmit: (el) => {
            props.onSubmit(el)
            props.fadeModal()
          }}
        )}
      </Modal.Body>
    </BaseModal>
  )
}



FormModal.propTypes = {
  confirmButtonText: T.string,
  isDangerous: T.bool,
  form: T.string.isRequired,
  onSubmit: T.func.isRequired,
  fadeModal: T.func.isRequired
}

export {FormModal}
