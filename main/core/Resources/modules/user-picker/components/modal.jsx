import React, {PropTypes as T} from 'react'
import Modal from 'react-bootstrap/lib/Modal'

const UserPickerModal = props =>
  <Modal
    show={true}
    onHide={props.fadeModal}
    onExited={props.hideModal}
    dialogClassName={props.className}
  >
    {props.title &&
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
    }

    <div> yolo </div>
  </Modal>

UserPickerModal.propTypes = {
  addCallback: T.func.isRequired,
  removeCallback: T.func.isRequired,
  show: T.bool.isRequired,
  title: T.string,
}

// required when testing proptypes on code instrumented by istanbul
// @see https://github.com/facebook/jest/issues/1824#issuecomment-250478026
UserPickerModal.displayName = 'UserPickerModal'

export {UserPickerModal}
