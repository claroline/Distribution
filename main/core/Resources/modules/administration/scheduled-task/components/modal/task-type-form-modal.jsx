import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import Modal from 'react-bootstrap/lib/Modal'

import {BaseModal} from '#/main/core/layout/modal/components/base.jsx'
import {taskTypes} from '../../enums'
import {navigate} from '../../router'

export const MODAL_TASK_TYPE_FORM = 'MODAL_TASK_TYPE_FORM'

const TaskTypeChoice = props =>
  <div
    className={classes('task-type-container', {'selected': props.selected})}
    onMouseOver={() => props.handleTypeMouseOver(props.type)}
    onClick={() => navigate(props.type.type, true)}
  >
    <span className={classes('task-type-icon', props.type.icon)} />
  </div>

TaskTypeChoice.propTypes = {
  type: T.shape({
    type: T.string.isRequired,
    name: T.string.isRequired,
    icon: T.string
  }).isRequired,
  selected: T.bool.isRequired,
  handleTypeMouseOver: T.func.isRequired
}

class TaskTypeFormModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentType: taskTypes[0],
      currentTypeName: taskTypes[0].name
    }
  }

  handleTypeMouseOver(type) {
    this.setState({
      currentType: type,
      currentTypeName: type.name
    })
  }

  render() {
    return (
      <BaseModal {...this.props} className="task-type-form-modal">
        <Modal.Body>
          <div className="task-type-list">
            {taskTypes.map(tt =>
              <TaskTypeChoice
                key={tt.type}
                type={tt}
                selected={this.state.currentType.type === tt.type}
                handleTypeMouseOver={() => this.handleTypeMouseOver(tt)}
              />
            )}
          </div>

          <div className="task-type-desc">
            <span className="task-type-name">
              {this.state.currentTypeName}
            </span>
          </div>
        </Modal.Body>
      </BaseModal>
    )
  }
}

TaskTypeFormModal.propTypes = {
  fadeModal: T.func.isRequired
}

export {
  TaskTypeFormModal
}
