import React from 'react'
import {connect} from 'react-redux'

import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {MODAL_LOG} from '#/main/core/administration/transfer/components/modal/log'
import {trans} from '#/main/core/translation'

import {DataListContainer} from '#/main/core/data/list/containers/data-list.jsx'
import {HistoryList} from '#/main/core/administration/transfer/components/history/history-list.jsx'

const Tab = props =>
  <DataListContainer
    name="history"
    primaryAction={(row) => ({
      id: 'logfile',
      type: 'callback',
      callback: () => props.openLog(row.log)
    })}
    fetch={{
      url: ['apiv2_transfer_list'],
      autoload: true
    }}
    delete={{
      url: ['apiv2_transfer_delete_bulk']
    }}
    definition={HistoryList.definition}
    actions={(rows) => [
      {
        type: 'callback',
        icon: 'fa fa-fw fa-save',
        label: trans('execute'),
        callback: () => alert('execute'),
        context: 'row'
      }
    ]}
  />

const ConnectedTab = connect(
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
)(Tab)

export {
  ConnectedTab as Tab
}
