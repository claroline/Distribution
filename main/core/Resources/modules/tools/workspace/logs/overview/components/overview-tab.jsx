import React from 'react'

import {Routes} from '#/main/core/router'
import {Logs, LogsActions} from '#/main/core/tools/workspace/logs/overview/components/logs.jsx'
import {LogDetails, LogDetailsActions} from '#/main/core/tools/workspace/logs/overview/components/log-details.jsx'

const OverviewTabActions = () =>
  <Routes
    routes={[
      {
        path: '/overview',
        exact: true,
        component: LogsActions
      }, {
        path: '/overview/details/:id',
        exact: true,
        component: LogDetailsActions
      }
    ]}
  />

const OverviewTab = () =>
  <Routes
    routes={[
      {
        path: '/overview',
        exact: true,
        component: Logs
      }, {
        path: '/overview/details/:id',
        exact: true,
        component: LogDetails
      }
    ]}
  />

export {
  OverviewTabActions,
  OverviewTab
}
