import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import Modal from 'react-bootstrap/lib/Modal'
import {connect} from 'react-redux'
import {trans} from '#/main/core/translation'
import {BaseModal} from '#/main/core/layout/modal/components/base.jsx'
import select from '../../selectors'
import {tex} from '#/main/core/translation'

export const MODAL_MOVE_QUESTION = 'MODAL_MOVE_QUESTION'

class MoveQuestionModal extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <BaseModal {...this.props} className="step-move-item-modal">
        <Modal.Body>
          <table>
            {Object.keys(this.props.steps).map((key, index) =>
              <tr><td><a className="pointer" onClick={() => this.props.handleClick(this.props.itemId, key)}> {tex('step') + ' ' + index} </a></td></tr>
            )}
          </table>
        </Modal.Body>
      </BaseModal>
    )
  }
}

MoveQuestionModal.propTypes = {
  handleClick: T.func.isRequired,
  steps: T.object.isRequired,
  itemId: T.string.isRequired,
}

function mapStateToProps(state) {
  return {
    steps: select.steps(state)
  }
}

const ConnectedMoveQuestionModal = connect(mapStateToProps, {})(MoveQuestionModal)

export {ConnectedMoveQuestionModal as MoveQuestionModal}
