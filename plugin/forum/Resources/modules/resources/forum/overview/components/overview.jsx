import React from 'react'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {number} from '#/main/core/intl'
import {Button} from '#/main/app/action/components/button'
import {CountGauge} from '#/main/core/layout/gauge/components/count-gauge'
import {MetricCard} from '#/main/core/layout/components/metric-card'
import {HtmlText} from '#/main/core/layout/components/html-text'
import {UserMessage} from '#/main/core/user/message/components/user-message'

import {select} from '#/plugin/forum/resources/forum/selectors'



const OverviewComponent = props =>
  <div>
    <section className="resource-section resource-overview">
      <h2 className="sr-only">{trans('resource_overview')}</h2>
      <div className="row">
        <div className="user-column col-md-4">
          <section className="user-progression">
            <h3 className="h2">{trans('my_participation', {}, 'forum')}</h3>
            <div className="panel panel-default">
              <div className="panel-body">
                <CountGauge
                  value={3}
                  displayValue={(value) => number(value, true)}
                />
                <h4 className="h5">{trans('my_messages', {}, 'forum')}</h4>
              </div>
            </div>
          </section>
          <section className="user-actions">
            <h3 className="sr-only">{trans('resource_overview_actions', {}, 'resource')}</h3>
            <Button
              label={trans('see_subjects', {}, 'forum')}
              type="link"
              target="/play/subject/3"
              className="btn btn-block"
              primary={true}
            />
            <Button
              label={trans('new_subject', {}, 'forum')}
              type="link"
              target="/play"
              className="btn btn-block"
            />
          </section>
        </div>

        <div className="resource-column col-md-8">
          <section className="resource-info">
            <h3 className="h2">{trans('resource_overview_info', {}, 'resource')}</h3>

            {props.forum.display.description &&
              <div className="panel panel-default">
                <HtmlText className="panel-body">{props.forum.display.description}</HtmlText>
              </div>
            }
          </section>
          <section className="resource-info row">
            <div className="col-md-4">
              <MetricCard
                value={props.forum.meta.users}
                cardTitle={trans('participating_users', {}, 'forum')}
              />
            </div>
            <div className="col-md-4">
              <MetricCard
                value={props.forum.meta.subjects}
                cardTitle={trans('subjects', {}, 'forum')}
              />
            </div>
            <div className="col-md-4">
              <MetricCard
                value={props.forum.meta.messages}
                cardTitle={trans('messages', {}, 'forum')}
              />
            </div>
          </section>
          <section>
            <h3 className="h2">{trans('last_messages', {}, 'forum')}</h3>
            <ul className="posts">
              {props.messages.map(message =>
                <li key={message.id} className="post">
                  <h4>Nom du sujet <a href="/play/subject">Voir le sujet</a></h4>
                  <UserMessage
                    user={message.meta.creator}
                    date={message.meta.created}
                    content={message.content}
                    allowHtml={true}
                  />
                </li>
              )}
            </ul>
          </section>

        </div>
      </div>
    </section>
  </div>


const Overview = connect(
  (state) => ({
    forum: select.forum(state),
    messages: select.messages(state)
  })
)(OverviewComponent)


export {
  Overview
}
