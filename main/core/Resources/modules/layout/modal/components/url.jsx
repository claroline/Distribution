import React, {PropTypes as T} from 'react'
import Modal from 'react-bootstrap/lib/Modal'

const UrlModal = props =>
  <Modal
    show={props.show}
    onHide={props.fadeModal}
    onExited={props.hideModal}
    dialogClassName={props.className}
  >
    <div dangerouslySetInnerHTML={{_html: props.content}}/>
  </Modal>

UrlModal.propTypes = {
  fadeModal: T.func.isRequired,
  hideModal: T.func.isRequired,
  show: T.bool.isRequired,
  className: T.string,
  content: T.string.isRequired
}

// required when testing proptypes on code instrumented by istanbul
// @see https://github.com/facebook/jest/issues/1824#issuecomment-250478026
UrlModal.displayName = 'BaseModal'

export {UrlModal}
