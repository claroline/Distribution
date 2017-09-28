import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import Modal from 'react-bootstrap/lib/Modal'
import {BaseModal} from '#/main/core/layout/modal/components/base.jsx'
import {t} from '#/main/core/translation'

export const MODAL_ENTRY_OWNER_FORM = 'MODAL_ENTRY_OWNER_FORM'

export class EntryOwnerFormModal  extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user : {}
    }
  }

  updateUser(user) {
    this.setState({user: user})
  }

  render() {
    return (
      <BaseModal {...this.props}>
        <Modal.Body>
          Coucouc
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-default" onClick={this.props.fadeModal}>
            {t('cancel')}
          </button>
          <button
            className="btn btn-primary"
            disabled={!this.state.user.id}
            onClick={() => console.log(this.state)}
          >
            {t('ok')}
          </button>
        </Modal.Footer>
      </BaseModal>
    )
  }
}

EntryOwnerFormModal.propTypes = {
  entryId: T.number.isRequired,
  confirmAction: T.func.isRequired,
  fadeModal: T.func.isRequired
}
