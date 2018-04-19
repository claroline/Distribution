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
            <h3 className="h2">{trans('my_participation', {}, 'forum')}</h3>
            <div className="panel panel-default overview-gauge">
              <div className="panel-body">
                <CountGauge
                  className="gauge"
                  value={3}
                  displayValue={(value) => number(value, true)}
                />
                <div>{trans('my_messages', {}, 'forum')}</div>
              </div>
            </div>
            <Button
              label={trans('see_subjects', {}, 'forum')}
              type="link"
              target="/play/subject/3"
              className="btn btn-block btn-primary primary btn-emphasis "
            />
            <Button
              label={trans('new_subject', {}, 'forum')}
              type="link"
              target="/play"
              className="btn btn-block btn-emphasis "
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
          <section className="resource-info row">
            <div className="col-md-4">
              <div className="info-gauge">
                <CountGauge
                  className="gauge"
                  value={129}
                  displayValue={(value) => number(value, true)}
                />
                <div>{trans('participating_users', {}, 'forum')}</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="info-gauge">
                <CountGauge
                  className="gauge"
                  value={14}
                  displayValue={(value) => number(value, true)}
                />
                <div>{trans('subjects', {}, 'forum')}</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="info-gauge">
                <CountGauge
                  className="gauge"
                  value={235}
                  displayValue={(value) => number(value, true)}
                />
                <div>{trans('messages', {}, 'forum')}</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  </div>

export {
  Overview
}
