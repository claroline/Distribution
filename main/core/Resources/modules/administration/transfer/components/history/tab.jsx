import React from 'react'
import {connect} from 'react-redux'

import {actions} from '#/main/core/administration/transfer/components/history/reducer'
import {trans} from '#/main/core/translation'
import {Routes} from '#/main/core/router'
//import {Logs} from '#/main/core/administration/transfer/components/log/logs.jsx'

import {DataListContainer} from '#/main/core/data/list/containers/data-list.jsx'
import {HistoryList} from '#/main/core/administration/transfer/components/history/history-list.jsx'

const Logs = () => <span>COUCOU</span>

const Tab = () =>
  <div className="col-md-9">
    <Routes
      routes={[
        {
          path: '/history',
          exact: true,
          component: List
        },
        {
          path: 'toto/:log',
          component: Logs/*,
          onEnter: (params) => {
            console.log('toto')
            //props.loadLog(params.log)
          }*/
        }
      ]}
    />
  </div>

const List = () =>
  <DataListContainer
    name="history"
    primaryAction={(row) => ({
      id: 'logfile',
      type: 'link',
      target: '/toto/' + row.log
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

const ConnectedTab = connect(
  null,
  dispatch => ({
    loadLog(filename) {
      dispatch(actions.load(filename))
    }
  })
)(Tab)

export {
  ConnectedTab as Tab
}
