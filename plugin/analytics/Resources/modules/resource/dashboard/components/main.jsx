import React, {Fragment} from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {Await} from '#/main/app/components/await'
import {Routes} from '#/main/app/router'
import {Vertical} from '#/main/app/content/tabs/components/vertical'
import {ContentLoader} from '#/main/app/content/components/loader'

import {getAnalytics} from '#/main/core/analytics/resource/utils'
import {LogDetails} from '#/main/core/layout/logs'

//import {Progression} from '#/plugin/analytics/resource/dashboard/containers/progression'
import {Connections} from '#/plugin/analytics/resource/dashboard/containers/connections'
import {Logs} from '#/plugin/analytics/resource/dashboard/containers/logs'
import {UserLogs} from '#/plugin/analytics/resource/dashboard/containers/logs-user'

const DashboardMain = (props) =>
  <Fragment>
    <Await
      for={getAnalytics(props.resourceNode)}
      placeholder={
        <ContentLoader
          size="lg"
          description={trans('loading')}
        />
      }
      then={(apps) => (
        <div className="row">
          <div className="col-md-3">
            <Vertical
              style={{
                marginTop: '20px'
              }}
              basePath={props.path}
              tabs={[
                {
                  icon: 'fa fa-fw fa-clock',
                  title: trans('connection_time'),
                  path: '/dashboard/connections'
                }, {
                  icon: 'fa fa-fw fa-users',
                  title: trans('users_actions'),
                  path: '/dashboard/log'
                }, {
                  icon: 'fa fa-fw fa-user',
                  title: trans('user_actions'),
                  path: '/dashboard/logs/users',
                  exact: true
                }
              ].concat(
                apps.map(app => ({
                  icon: app.icon,
                  title: app.label,
                  path: `/dashboard/${app.path}`
                }))
              )}
            />
          </div>

          <div className="dashboard-content col-md-9">
            <Routes
              path={props.path}
              routes={[
                {
                  path: '/dashboard/connections',
                  component: Connections,
                  exact: true
                }, {
                  path: '/dashboard/log',
                  component: Logs,
                  exact: true
                }, {
                  path: '/dashboard/log/:id',
                  component: LogDetails,
                  onEnter: (params) => props.openLog(params.id)
                }, {
                  path: '/dashboard/logs/users',
                  component: UserLogs,
                  exact: true
                }
              ].concat(
                apps.map(app => ({
                  path: `/dashboard/${app.path}`,
                  component: app.component
                }))
              )}
            />
          </div>
        </div>
      )}
    />
  </Fragment>

DashboardMain.propTypes = {
  path: T.string.isRequired,
  resourceNode: T.object.isRequired,
  openLog: T.func.isRequired
}

export {
  DashboardMain
}
