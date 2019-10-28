import React, {Fragment} from 'react'
import {schemeCategory20c} from 'd3-scale'

import {trans} from '#/main/app/intl/translation'

import {ResourcesChart} from '#/plugin/analytics/charts/resources/containers/chart'

const ContentDashboard = () =>
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
        <span className="fa fa-server" style={{backgroundColor: schemeCategory20c[9]}} />

        <h1 className="h3">
          <small>{trans('storage_used')}</small>
          10.5 Go
        </h1>
      </div>
    </div>

    <div className="row">
      <div className="col-md-4">
        <ResourcesChart />
      </div>

      <div className="col-md-8">
      </div>
    </div>
  </Fragment>


export {
  ContentDashboard
}
