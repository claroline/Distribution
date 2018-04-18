import React from 'react'

import {trans} from '#/main/core/translation'
import {number} from '#/main/core/intl'
import {Button} from '#/main/app/action/components/button'
import {CountGauge} from '#/main/core/layout/gauge/components/count-gauge.jsx'
import {HtmlText} from '#/main/core/layout/components/html-text.jsx'


const Overview = props =>
  <div>
    <section className="resource-section resource-overview">
      <h2 className="sr-only">{trans('resource_overview')}</h2>

      <div className="row">
        <div className="user-column col-md-4">
          <section className="user-progression">
            <h3 className="h2">{trans('user_info')}</h3>
            <div className="panel panel-default overview-gauge">
              <div className="panel-body info-gauge">
                <CountGauge
                  className="gauge"
                  value={3}
                  displayValue={(value) => number(value, true)}
                />
                <div>Your messages</div>
              </div>
            </div>
            <Button
              label="Go to the forum"
              type="link"
              target="/play"
              className="btn btn-block btn-primary primary btn-emphasis "
            />
          </section>
        </div>

        <div className="resource-column col-md-8">
          <section className="resource-info">
            <h3 className="h2">{trans('resource_overview_info', {}, 'resource')}</h3>

            <div className="panel panel-default">
              <HtmlText className="panel-body">Aucune consigne</HtmlText>
            </div>
          </section>
          <section className="resource-info">
            <h3 className="h2">{trans('data')}</h3>
            <div className="info-gauge col-md-4">
              <CountGauge
                className="gauge"
                value={129}
                displayValue={(value) => number(value, true)}
              />
              <div>{trans('registered_users')}</div>
            </div>
            <div className="info-gauge col-md-4">
              <CountGauge
                className="gauge"
                value={14}
                displayValue={(value) => number(value, true)}
              />
              <div>{trans('subjects', {}, 'forum')}</div>
            </div>
            <div className="info-gauge ">
              <CountGauge
                className="gauge"
                value={235}
                displayValue={(value) => number(value, true)}
              />
              <div>{trans('messages', {}, 'forum')}</div>
            </div>
          </section>
        </div>
      </div>
    </section>
  </div>

export {
  Overview
}
