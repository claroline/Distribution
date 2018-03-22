import React from 'react'

import {PageActions} from '#/main/core/layout/page/components/page-actions.jsx'
import {FormPageActionsContainer} from '#/main/core/data/form/containers/page-actions.jsx'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {MODAL_LOG} from '#/main/core/layout/log'

import {connect} from 'react-redux'

const Action = props =>
  <PageActions>
    <FormPageActionsContainer
      formName="import"
      target={['apiv2_transfer_start', {log: '123'}]}
      opened={true}
      save={{action: () => props.openLog('123')}}
    />
  </PageActions>

const ConnectedAction = connect(
  null,
  dispatch => ({
    openLog() {
      dispatch(
        modalActions.showModal(MODAL_LOG, {
          file: '123'
        })
      )
    }
  })
)(Action)

export {
  ConnectedAction as Action
}
