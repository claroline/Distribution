import React from 'react'
import {trans} from '#/main/core/translation'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {DataListContainer} from '#/main/core/data/list/containers/data-list.jsx'
import {constants as listConst} from '#/main/core/data/list/constants'
import {UserActionsCard} from '#/main/core/tools/workspace/logs/components/users/user-actions-card.jsx'

const UserLogList = props =>
  <DataListContainer
    name="userActions"
    fetch={{
      url: ['apiv2_workspace_tool_logs_list_users', {workspaceId: props.workspaceId}],
      autoload: true
    }}
    open={false}
    delete={false}
    definition={[
      {
        name: 'doer.name',
        type: 'string',
        label: trans('user'),
        displayed: true,
        primary: true
      }, {
        name: 'actions',
        type: 'number',
        label: trans('actions'),
        displayed: true
      }
    ]}

    card={UserActionsCard}
    
    display={{
      available : [listConst.DISPLAY_TABLE, listConst.DISPLAY_TABLE_SM, listConst.DISPLAY_LIST],
      current: listConst.DISPLAY_LIST
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