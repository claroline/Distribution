import React from 'react'
import {connect} from 'react-redux'

import {withRouter} from '#/main/app/router'

import {actions as logActions} from  '#/main/core/layout/logs/actions'
import {DashboardTool as DashboardToolComponent} from '#/main/core/tools/dashboard/components/tool'

const DashboardTool = withRouter(connect(
  state => ({
    workspaceId: state.workspace.id
  }),
  dispatch => ({
    openLog(id, workspaceId) {
      dispatch(logActions.openLog('apiv2_workspace_tool_logs_get', {id, workspaceId}))
    }
  })
)(DashboardToolComponent))

export {
  DashboardTool
}
