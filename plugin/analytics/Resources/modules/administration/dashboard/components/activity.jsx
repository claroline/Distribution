import React, {Fragment} from 'react'
import {schemeCategory20c} from 'd3-scale'

import {trans} from '#/main/app/intl/translation'

import {ActionsChart} from '#/plugin/analytics/charts/actions/containers/chart'
import {ConnectionTimeChart} from '#/plugin/analytics/charts/connection-time/containers/chart'

const ActivityDashboard = () =>
  <Fragment>
    <div className="row">
      <div className="analytics-card">
        <span className="fa fa-power-off" style={{backgroundColor: schemeCategory20c[1]}} />

        <h1 className="h3">
          <small>{trans('Connexions')}</small>
          67
        </h1>
      </div>

      <div className="analytics-card">
        <span className="fa fa-clock" style={{backgroundColor: schemeCategory20c[5]}} />

        <h1 className="h3">
          <small>{trans('connection_time')}</small>
          68min en moyenne
        </h1>
      </div>
    </div>

    <div className="row">
      <div className="col-md-6">
        <ActionsChart />
      </div>

      <div className="col-md-6">
        <ConnectionTimeChart />
      </div>
    </div>
  </Fragment>

export {
  ActivityDashboard
}
