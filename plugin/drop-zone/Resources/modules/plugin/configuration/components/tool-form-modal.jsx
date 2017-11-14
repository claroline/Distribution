import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import Modal from 'react-bootstrap/lib/Modal'
import {BaseModal} from '#/main/core/layout/modal/components/base.jsx'
import {t, trans} from '#/main/core/translation'
import {TextGroup}  from '#/main/core/layout/form/components/group/text-group.jsx'

export const MODAL_TOOL_FORM = 'MODAL_TOOL_FORM'

export class ToolFormModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tool: props.tool
    }
  }

  render() {
    return (
      <BaseModal {...this.props}>
        <Modal.Body>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-default"
            onClick={this.props.fadeModal}
          >
            {t('cancel')}
          </button>
          <button
            className="btn btn-default"
            onClick={this.props.fadeModal}
          >
            {t('cancel')}
          </button>
        </Modal.Footer>
      </BaseModal>
    )
  }
}

ToolFormModal.propTypes = {
  fadeModal: T.func.isRequired
}
