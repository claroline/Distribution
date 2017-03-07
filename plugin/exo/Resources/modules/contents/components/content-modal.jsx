import React, {PropTypes as T} from 'react'
import Modal from 'react-bootstrap/lib/Modal'
import {getContentDefinition} from './../content-types'

export const MODAL_CONTENT = 'MODAL_CONTENT'

export const ContentModal = props =>
  <Modal className="content-modal"
         show={props.show}
         onHide={props.fadeModal}
         onExited={props.hideModal}
  >
      <span className="content-modal-controls">
        <span className="content-modal-close-btn fa fa-times"
              onClick={props.hideModal}
        >
        </span>
      </span>
      {props.data &&
        React.createElement(getContentDefinition(props.type).modal, {data: props.data, type: props.type})
      }
  </Modal>

ContentModal.propTypes = {
  show: T.bool.isRequired,
  fadeModal: T.func.isRequired,
  hideModal: T.func.isRequired,
  data: T.string,
  type: T.string.isRequired
}
