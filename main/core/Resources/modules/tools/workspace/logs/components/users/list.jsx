import React from 'react'
import {trans} from '#/main/core/translation'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {DataListContainer} from '#/main/core/data/list/containers/data-list.jsx'
import {constants as listConst} from '#/main/core/data/list/constants'
const UserLogList = props =>
  <DataListContainer
    name="logs"
    fetch={{
      url: ['apiv2_workspace_tool_logs_list', {workspaceId: props.workspaceId}],
      autoload: true
    }}
    open={{
      action: (row) => `#/log/${row.id}`
    }}
    delete={false}
    definition={[
      {
        name: 'dateLog',
        type: 'date',
        label: trans('date'),
        displayed: true,
        primary: true
      }, {
        name: 'action',
        type: 'string',
        label: trans('action', {}, 'log'),
        displayed: true
      }, {
        name: 'user',
        type: 'string',
        label: trans('user'),
        displayed: true
      }, {
        name: 'description',
        type: 'string',
        label: trans('description'),
        displayed: true
      }
    ]}

    card={()=>{}}
    
    display={{
      available : [listConst.DISPLAY_TABLE, listConst.DISPLAY_TABLE_SM],
      current: listConst.DISPLAY_TABLE
    }}
  />

UserLogList.propTypes = {
  workspaceId: T.number.isRequired
}

const UserLogListContainer = connect(
  state => ({
    workspaceId: state.workspaceId
  }),
  null
)(UserLogList)

export {
  UserLogListContainer as UserLogs
}