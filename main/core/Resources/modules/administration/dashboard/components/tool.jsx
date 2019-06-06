import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {Routes} from '#/main/app/router'
import {Vertical} from '#/main/app/content/tabs/components/vertical'

import {ToolPage} from '#/main/core/tool/containers/page'

// app sections
import {OverviewTab} from '#/main/core/administration/dashboard/components/overview/tab'
import {AudienceTab} from '#/main/core/administration/dashboard/components/audience/tab'
import {ResourcesTab} from '#/main/core/administration/dashboard/components/resources/tab'
import {WidgetsTab} from '#/main/core/administration/dashboard/components/widgets/tab'
import {TopActionsTab} from '#/main/core/administration/dashboard/components/top-actions/tab'
import {Connections} from '#/main/core/administration/dashboard/components/connections/connections'
import {Logs} from '#/main/core/administration/dashboard/components/logs/logs'
import {UserLogs} from '#/main/core/administration/dashboard/components/logs/logs-user'
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
              title: trans('analytics_home'),
              path: '/',
              exact: true
            }, {
              icon: 'fa fa-line-chart',
              title: trans('user_visit'),
              path: '/audience'
            }, {
              icon: 'fa fa-folder',
              title: trans('analytics_resources'),
              path: '/resources'
            }, {
              icon: 'fa fa-list-alt',
              title: trans('widgets'),
              path: '/widgets'
            }, {
              icon: 'fa fa-sort-amount-desc',
              title: trans('analytics_top'),
              path: '/top'
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
            }
          ]}
        />
      </div>

      <div className="dashboard-content col-md-9">
        <Routes
          routes={[
            {
              path: '/',
              component: OverviewTab,
              exact: true
            }, {
              path: '/audience',
              component: AudienceTab,
              exact: true
            }, {
              path: '/resources',
              component: ResourcesTab,
              exact: true
            }, {
              path: '/widgets',
              component: WidgetsTab,
              exact: true
            }, {
              path: '/top',
              component: TopActionsTab,
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
              onEnter: (params) => props.openLog(params.id)
            }, {
              path: '/logs/users',
              component: UserLogs,
              exact: true
            }
          ]}
        />
      </div>
    </div>
  </ToolPage>

DashboardTool.propTypes = {
  openLog: T.func.isRequired
}

export {
  DashboardTool
}
