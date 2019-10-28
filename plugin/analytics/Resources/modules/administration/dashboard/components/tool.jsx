import React from 'react'
import {PropTypes as T} from 'prop-types'

import {url} from '#/main/app/api'
import {trans} from '#/main/app/intl/translation'
import {DOWNLOAD_BUTTON} from '#/main/app/buttons'
import {matchPath, Routes} from '#/main/app/router'

import {ToolPage} from '#/main/core/tool/containers/page'
import {Audience} from '#/plugin/analytics/administration/dashboard/components/audience'
import {TopActions} from '#/plugin/analytics/administration/dashboard/components/top-actions'
import {Connections} from '#/plugin/analytics/administration/dashboard/components/connections'
import {Logs} from '#/plugin/analytics/administration/dashboard/components/logs'
import {UserLogs} from '#/plugin/analytics/administration/dashboard/components/logs-user'
import {LogDetails} from '#/main/core/layout/logs'

import {Overview} from '#/plugin/analytics/administration/dashboard/components/overview'
import {ActivityDashboard} from '#/plugin/analytics/administration/dashboard/components/activity'
import {ContentDashboard} from '#/plugin/analytics/administration/dashboard/components/content'
import {CommunityDashboard} from '#/plugin/analytics/administration/dashboard/components/community'

const DashboardTool = (props) =>
  <ToolPage
    actions={[
      {
        name: 'download',
        type: DOWNLOAD_BUTTON,
        file: {
          url: url(['apiv2_log_connect_platform_list_csv']) + props.connectionsQuery
        },
        label: trans('download_csv_list', {}, 'log'),
        icon: 'fa fa-download',
        displayed: matchPath(props.location.pathname, {path: `${props.path}/connections`, exact: true})
      }, {
        name: 'download',
        type: DOWNLOAD_BUTTON,
        file: {
          url: url(['apiv2_admin_tool_logs_list_csv']) + props.logsQuery
        },
        label: trans('download_csv_list', {}, 'log'),
        icon: 'fa fa-download',
        displayed: matchPath(props.location.pathname, {path: `${props.path}/log`, exact: true})
      }, {
        name: 'download',
        type: DOWNLOAD_BUTTON,
        file: {
          url: url(['apiv2_admin_tool_logs_list_users_csv']) + props.usersQuery
        },
        label: trans('download_csv_list', {}, 'log'),
        icon: 'fa fa-download',
        displayed: matchPath(props.location.pathname, {path: `${props.path}/logs/users`, exact: true})
      }
    ]}
    subtitle={
      <Routes
        path={props.path}
        routes={[
          {
            path: '/',
            render: () => trans('overview', {}, 'analytics'),
            exact: true
          }, {
            path: '/activity',
            render: () => trans('activity')
          }, {
            path: '/content',
            render: () => trans('content')
          }, {
            path: '/community',
            render: () => trans('community')
          },



          {
            path: '/audience',
            render: () => trans('user_visit')
          }, {
            path: '/top',
            render: () => trans('analytics_top')
          }, {
            path: '/connections',
            render: () => trans('connection_time')
          }, {
            path: '/log',
            render: () => trans('users_actions')
          }, {
            path: '/logs/users',
            render: () => trans('user_actions')
          }
        ]}
      />
    }
  >
    <Routes
      path={props.path}
      routes={[
        {
          path: '/',
          component: Overview,
          exact: true
        }, {
          path: '/activity',
          component: ActivityDashboard
        }, {
          path: '/content',
          component: ContentDashboard
        }, {
          path: '/community',
          component: CommunityDashboard
        },


        {
          path: '/audience',
          component: Audience
        }, {
          path: '/top',
          component: TopActions
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
          onEnter: (params) => props.openLog(params.id)
        }, {
          path: '/logs/users',
          component: UserLogs
        }
      ]}
    />
  </ToolPage>

DashboardTool.propTypes = {
  path: T.string.isRequired,
  location: T.object.isRequired,
  connectionsQuery: T.string,
  logsQuery: T.string,
  usersQuery: T.string,
  openLog: T.func.isRequired
}

export {
  DashboardTool
}
