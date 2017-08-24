import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import Modal from 'react-bootstrap/lib/Modal'
import {connect} from 'react-redux'
import {BaseModal} from '#/main/core/layout/modal/components/base.jsx'
import select from '../../selectors'
import {tex} from '#/main/core/translation'
import {FormGroup} from '#/main/core/layout/form/components/form-group.jsx'

export const MODAL_DUPLICATE_QUESTION = 'MODAL_DUPLICATE_QUESTION'

class DuplicateQuestionModal extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleChange(value) {
    this.setState({value})
  }

  render() {
    return (
      <BaseModal {...this.props} className="step-move-item-modal">
        <Modal.Body>
          <div>
            <FormGroup
              controlId={`item-${this.props.itemId}-duplicate`}
              label={tex('amount')}
            >
              <input
                id={`item-${this.props.itemId}-duplicate`}
                type="number"
                min="1"
                className="form-control"
                onChange={e => this.handleChange(parseInt(e.target.value))}
              />
            </FormGroup>
          </div>
          <button
            className="modal-btn btn btn-primary"
            onClick={() => this.props.handleSubmit(this.state.value, this.props.itemId, this.props.stepId)}
          >
            {tex('duplicate')}
          </button>
          <button
            className="modal-btn btn btn-secondary"
            onClick={() => alert('close')}
          >
            {tex('close')}
          </button>
        </Modal.Body>
      </BaseModal>
    )
  }
}

DuplicateQuestionModal.propTypes = {
  handleSubmit: T.func.isRequired,
  itemId: T.string.isRequired,
  stepId: T.string.isRequired,
  fadeModal: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    steps: select.steps(state)
  }
}

const ConnectedMoveQuestionModal = connect(mapStateToProps, {})(DuplicateQuestionModal)

export {ConnectedMoveQuestionModal as DuplicateQuestionModal}
