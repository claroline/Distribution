import React from 'react'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {Routes} from '#/main/app/router'
import {Vertical} from '#/main/app/content/tabs/components/vertical'

import {ToolPage} from '#/main/core/tool/containers/page'
import {AnalyticsTool} from '#/main/core/workspace/analytics/components/analytics-tool'
import {LogTool} from '#/main/core/workspace/logs/components/tool'
import {ProgressionTool} from '#/main/core/tools/progression/components/tool'
import {Connections} from '#/main/core/workspace/logs/connection/components/connections'
import {Logs} from '#/main/core/workspace/logs/log/components/log-list'
import {UserLogs} from '#/main/core/workspace/logs/log/components/user-list'
import {LogDetails} from '#/main/core/layout/logs'
import {actions as logActions} from  '#/main/core/layout/logs/actions'

const Tool = (props) =>
  <ToolPage>
    <div className="row">
      <div className="col-md-3">
        <Vertical
          style={{
            marginTop: '20px'
          }}
          tabs={[
            {
              icon: 'fa fa-fw fa-pie-chart',
              title: trans('dashboard', {}, 'tools'),
              path: '/',
              exact: true
            // }, {
            //   icon: 'fa fa-fw fa-line-chart',
            //   title: trans('logs', {}, 'tools'),
            //   path: '/logs'
            }, {
              icon: 'fa fa-fw fa-clock',
              title: trans('connection_time'),
              path: '/connections'
            }, {
              icon: 'fa fa-fw fa-user',
              title: trans('users_tracking'),
              path: '/log'
            }, {
              icon: 'fa fa-fw fa-tasks',
              title: trans('progression', {}, 'tools'),
              path: '/progression',
              exact: true
            }
          ]}
        />
      </div>

      <div className="dashboard-content col-md-9">
        <Routes
          routes={[
            {
              path: '/',
              component: AnalyticsTool,
              exact: true
            }, {
              path: '/connections',
              component: Connections
            }, {
              path: '/log',
              component: Logs,
              exact: true
            }, {
              path: '/log/:id',
              component: LogDetails,
              exact: true,
              onEnter: (params) => props.openLog(params.id, props.workspaceId)
            }, {
              path: '/log/users/logs',
              component: UserLogs,
              exact: true
            }, {
              path: '/progression',
              component: ProgressionTool
            }
          ]}
        />
      </div>
    </div>
  </ToolPage>

Tool.propTypes = {
  workspaceId: T.string,
  openLog: T.func
}

const DashboardTool = connect(
  state => ({
    workspaceId: state.workspace.id
  }),
  dispatch => ({
    openLog(id, workspaceId) {
      dispatch(logActions.openLog('apiv2_workspace_tool_logs_get', {id, workspaceId}))
    }
  })
)(Tool)

export {
  DashboardTool
}
