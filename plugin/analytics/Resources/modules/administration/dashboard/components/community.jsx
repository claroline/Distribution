import React, {Fragment} from 'react'
import {schemeCategory20c} from 'd3-scale'

import {trans} from '#/main/app/intl/translation'

const CommunityDashboard = () =>
  <Fragment>
    <div className="row">
      <div className="analytics-card">
        <span className="fa fa-user" style={{backgroundColor: schemeCategory20c[1]}} />

        <h1 className="h3">
          <small>{trans('users')}</small>
          67
        </h1>
      </div>

      <div className="analytics-card">
        <span className="fa fa-users" style={{backgroundColor: schemeCategory20c[5]}} />

        <h1 className="h3">
          <small>{trans('groups')}</small>
          16
        </h1>
      </div>

      <div className="analytics-card">
        <span className="fa fa-id-badge" style={{backgroundColor: schemeCategory20c[9]}} />

        <h1 className="h3">
          <small>{trans('roles')}</small>
          9
        </h1>
      </div>

      <div className="analytics-card">
        <span className="fa fa-building" style={{backgroundColor: schemeCategory20c[13]}} />

        <h1 className="h3">
          <small>{trans('organizations')}</small>
          4
        </h1>
      </div>
    </div>
  </Fragment>

export {
  CommunityDashboard
}
