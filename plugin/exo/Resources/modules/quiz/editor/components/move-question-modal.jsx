import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import Modal from 'react-bootstrap/lib/Modal'
import {connect} from 'react-redux'
import {trans} from '#/main/core/translation'
import {BaseModal} from '#/main/core/layout/modal/components/base.jsx'
import select from '../../selectors'
import {tex} from '#/main/core/translation'
import {actions as modalActions} from '#/main/core/layout/modal/actions'

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
            <tbody>
              {Object.keys(this.props.steps).map((key, index) =>
                <tr
                  key={index}>
                  <td><a
                    className="pointer"
                    onClick={() => {
                      this.props.handleClick(this.props.itemId, key)
                      this.props.fadeModal()
                    }}
                  > {tex('step') + ' ' + (index + 1)}
                  </a></td>
                </tr>
              )}
            </tbody>
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
  fadeModal: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    steps: select.steps(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fadeModal() {
      dispatch(modalActions.fadeModal())
    }
  }
}

const ConnectedMoveQuestionModal = connect(mapStateToProps, {})(MoveQuestionModal)

export {ConnectedMoveQuestionModal as MoveQuestionModal}
