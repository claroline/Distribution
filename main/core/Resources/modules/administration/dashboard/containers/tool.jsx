import {connect} from 'react-redux'

import {withRouter} from '#/main/app/router'

import {actions as logActions} from  '#/main/core/layout/logs/actions'
import {DashboardTool as DashboardToolComponent} from '#/main/core/administration/dashboard/components/tool'

const DashboardTool = withRouter(connect(
  null,
  dispatch => ({
    openLog(id) {
      dispatch(logActions.openLog('apiv2_admin_tool_logs_get', {id}))
    }
  })
)(DashboardToolComponent))

export {
  DashboardTool
}
