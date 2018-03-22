import React, {Component} from 'react'

import {PageActions} from '#/main/core/layout/page/components/page-actions.jsx'
import {FormPageActionsContainer} from '#/main/core/data/form/containers/page-actions.jsx'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {MODAL_LOG} from '#/main/core/layout/log'

import {connect} from 'react-redux'

class Action extends Component {
  constructor(props) {
    super(props)
    this.currentLogId = this.generateLogId()
  }

  generateLogId() {
    const log = Math.random().toString(36).substring(7)
    this.currentLogId = log

    return log
  }

  getLogId() {
    return this.currentLogId
  }

  render() {
    return(
      <PageActions>
        <FormPageActionsContainer
          formName="import"
          target={['apiv2_transfer_start', {log: this.getLogId()}]}
          opened={true}
          save={{action: () => {
            this.props.openLog(this.getLogId())
            this.generateLogId()
          }}}
        />
      </PageActions>
    )
  }
}


const ConnectedAction = connect(
  null,
  dispatch => ({
    openLog(filename) {
      dispatch(
        modalActions.showModal(MODAL_LOG, {
          file: filename
        })
      )
    }
  })
)(Action)

export {
  ConnectedAction as Action
}
