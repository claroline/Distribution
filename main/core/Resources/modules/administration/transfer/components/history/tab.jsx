import React from 'react'
import {connect} from 'react-redux'

import {actions} from '#/main/core/administration/transfer/components/history/reducer'
import {trans} from '#/main/core/translation'
import {Routes} from '#/main/core/router'
import {Logs} from '#/main/core/administration/transfer/components/log/logs.jsx'

import {DataListContainer} from '#/main/core/data/list/containers/data-list.jsx'
import {HistoryList} from '#/main/core/administration/transfer/components/history/history-list.jsx'
import {withRouter} from '#/main/core/router'

const Tab = props =>
  <div className="col-md-9">
    <Routes
      routes={[
        {
          path: '/history',
          exact: true,
          component: List
        },
        {
          path: 'history/:log?',
          component: Logs,
          onEnter: (params) => {
            props.loadLog(params.log)
          }
        }
      ]}
    />
  </div>

const List = props =>
  <DataListContainer
    name="history"
    primaryAction={(row) => ({
      id: 'logfile',
      type: 'callback',
      callback: () => props.history.push('/history/' + row.log)
    })}
    fetch={{
      url: ['apiv2_transfer_list'],
      autoload: true
    }}
    delete={{
      url: ['apiv2_transfer_delete_bulk']
    }}
    definition={HistoryList.definition}
    actions={() => [
      {
        type: 'callback',
        icon: 'fa fa-fw fa-save',
        label: trans('execute'),
        callback: () => alert('execute'),
        context: 'row'
      }
    ]}
  />

const ConnectedTab = withRouter(connect(
  null,
  dispatch => ({
    loadLog(filename) {
      dispatch(actions.load(filename))
    }
  })
)(Tab))

export {
  ConnectedTab as Tab
}
