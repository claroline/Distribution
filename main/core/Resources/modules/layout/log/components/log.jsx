import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import Modal from 'react-bootstrap/lib/Modal'

import {connect} from 'react-redux'
import {trans} from '#/main/core/translation'
import {BaseModal} from '#/main/core/layout/modal/components/base.jsx'
import {actions} from '#/main/core/layout/log/actions'

class LogModal extends Component {
  render() {
    return (
      <BaseModal {...this.props}>
        <Modal.Body>
          <pre id="log-content">
            {this.props.message}
          </pre>
        </Modal.Body>
        <button
          className="modal-btn btn btn-primary"
          onClick={() => this.props.fadeModal()}
        >
          {trans('hide')}
        </button>
      </BaseModal>
    )
  }

  componentDidMount() {
    //la boucle
    this.props.load(this.props.file)
  }
}

LogModal.propTypes = {
  message: T.string.isRequired,
  fadeModal: T.func.isRequired,
  file: T.string.isRequired,
  load: T.func.isRequired
}

LogModal.defaultProps = {
  bsStyle: 'info',
  content: ''
}

const ConnectedModal = connect(
  state => ({
    message: state.log
  }),
  dispatch => ({
    load(file) {
      dispatch(actions.load(file))
    }
  })
)(LogModal)

export {ConnectedModal as LogModal}
