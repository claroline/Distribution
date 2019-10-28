import React, {Fragment} from 'react'
import {schemeCategory20c} from 'd3-scale'

import {trans} from '#/main/app/intl/translation'

import {ActivityChart} from '#/plugin/analytics/charts/activity/containers/chart'
import {LatestActionsChart} from '#/plugin/analytics/charts/latest-actions/components/chart'
import {ResourcesChart} from '#/plugin/analytics/charts/resources/containers/chart'
import {TopResourcesChart} from '#/plugin/analytics/charts/top-resources/containers/chart'
import {TopUsersChart} from '#/plugin/analytics/charts/top-users/containers/chart'
import {UsersChart} from '#/plugin/analytics/charts/users/containers/chart'

const Overview = () =>
  <Fragment>
    <div className="row">
      <div className="analytics-card">
        <span className="fa fa-book" style={{backgroundColor: schemeCategory20c[1]}} />

        <h1 className="h3">
          <small>{trans('workspaces')}</small>
          30
        </h1>
      </div>

      <div className="analytics-card">
        <span className="fa fa-folder" style={{backgroundColor: schemeCategory20c[5]}} />

        <h1 className="h3">
          <small>{trans('resources')}</small>
          123
        </h1>
      </div>

      <div className="analytics-card">
        <span className="fa fa-user" style={{backgroundColor: schemeCategory20c[9]}} />

        <h1 className="h3">
          <small>{trans('users')}</small>
          67
        </h1>
      </div>

      <div className="analytics-card">
        <span className="fa fa-clock" style={{backgroundColor: schemeCategory20c[13]}} />

        <h1 className="h3">
          <small>{trans('Connexions')}</small>
          67 (68min en moyenne)
        </h1>
      </div>
    </div>

    <div className="row">
      <div className="col-md-8">
        <ActivityChart />

        <div className="row">
          <div className="col-md-4">
            <ResourcesChart />
          </div>

          <div className="col-md-8">
            <TopResourcesChart />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <UsersChart />
          </div>

          <div className="col-md-8">
            <TopUsersChart />
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <LatestActionsChart />
      </div>
    </div>
  </Fragment>

export {
  Overview
}
