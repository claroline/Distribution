import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import Modal from 'react-bootstrap/lib/Modal'

import {connect} from 'react-redux'
import {trans} from '#/main/core/translation'
import {BaseModal} from '#/main/core/layout/modal/components/base.jsx'
import {actions} from '#/main/core/administration/transfer/components/modal/log/actions'
import {Error} from '#/main/core/administration/transfer/components/modal/log/components/error'
import {Success} from '#/main/core/administration/transfer/components/modal/log/components/success'
import {Logs} from '#/main/core/administration/transfer/components/log/logs.jsx'


  /*this.props.data.log.map(error => <Error {...error} />)*/

class LogModal extends Component {
  render() {
    return (
      <BaseModal {...this.props}>
        <Modal.Body>
          <Logs {...this.props}/>
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
    const refresher = setInterval(() => {
      this.props.load(this.props.file)
      if (this.props.data.total !== undefined && this.props.data.processed === this.props.data.total) {
          clearInterval(refresher)
      }
    }, 2000)
  }
}

LogModal.propTypes = {
  data: T.object.isRequired,
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
    data: state.log
  }),
  dispatch => ({
    load(file) {
      dispatch(actions.load(file))
    }
  })
)(LogModal)

export {ConnectedModal as LogModal}
