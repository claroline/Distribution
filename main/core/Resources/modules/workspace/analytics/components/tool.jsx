import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {Routes} from '#/main/app/router'
import {Vertical} from '#/main/app/content/tabs/components/vertical'

import {actions as logActions} from  '#/main/core/layout/logs/actions'
import {ToolPage} from '#/main/core/tool/containers/page'
import {AnalyticsTool} from '#/main/core/workspace/analytics/components/analytics-tool'
import {ProgressionTool} from '#/main/core/tools/progression/components/tool'
import {Connections} from '#/main/core/workspace/logs/connection/components/connections'
import {Logs} from '#/main/core/workspace/logs/log/components/log-list'
import {UserLogs} from '#/main/core/workspace/logs/log/components/user-list'
import {LogDetails} from '#/main/core/layout/logs'

const DashboardTool = (props) =>
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
            }, {
              icon: 'fa fa-fw fa-clock',
              title: trans('connection_time'),
              path: '/connections'
            }, {
              icon: 'fa fa-fw fa-users',
              title: trans('users_tracking'),
              path: '/log'
            }, {
              icon: 'fa fa-fw fa-user',
              title: trans('user_tracking', {}, 'log'),
              path: '/logs/users',
              exact: true
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
              component: Connections,
              exact: true
            }, {
              path: '/log',
              component: Logs,
              exact: true
            }, {
              path: '/log/:id',
              component: LogDetails,
              onEnter: (params) => props.openLog(params.id, props.workspaceId)
            }, {
              path: '/logs/users',
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

DashboardTool.propTypes = {
  workspaceId: T.string,
  openLog: T.func
}

export {
  DashboardTool
}
