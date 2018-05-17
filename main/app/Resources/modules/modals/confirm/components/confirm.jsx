import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {trans} from '#/main/core/translation'
import {HtmlText} from '#/main/core/layout/components/html-text'

import {Modal} from '#/main/app/overlay/modal/components/modal'

const ConfirmModal = props =>
  <Modal {...props}>
    <HtmlText className="modal-body">{props.question}</HtmlText>

    <button
      className={classes('modal-btn btn', props.dangerous ? 'btn-danger' : 'btn-primary')}
      onClick={() => {
        props.handleConfirm()
        props.fadeModal()
      }}
    >
      {props.confirmButtonText || trans('confirm')}
    </button>
  </Modal>

ConfirmModal.propTypes = {
  confirmButtonText: T.string,
  dangerous: T.bool,
  question: T.string.isRequired, // It can be plain text or HTML
  handleConfirm: T.func.isRequired,
  fadeModal: T.func.isRequired
}

ConfirmModal.defaultProps = {
  dangerous: false
}

export {
  ConfirmModal
}
