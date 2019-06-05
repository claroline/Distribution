import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {Routes} from '#/main/app/router'
import {Vertical} from '#/main/app/content/tabs/components/vertical'

import {ToolPage} from '#/main/core/tool/containers/page'
import {Analytics} from '#/main/core/tools/dashboard/components/analytics'
import {Connections} from '#/main/core/tools/dashboard/components/connections'
import {Logs} from '#/main/core/tools/dashboard/components/logs'
import {UserLogs} from '#/main/core/tools/dashboard/components/logs-user'
import {LogDetails} from '#/main/core/layout/logs'
import {Progression} from '#/main/core/tools/dashboard/components/progression'

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
              title: trans('analytics'),
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
              title: trans('progression'),
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
              component: Analytics,
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
              component: Progression
            }
          ]}
        />
      </div>
    </div>
  </ToolPage>

DashboardTool.propTypes = {
  workspaceId: T.number.isRequired,
  openLog: T.func.isRequired
}

export {
  DashboardTool
}
