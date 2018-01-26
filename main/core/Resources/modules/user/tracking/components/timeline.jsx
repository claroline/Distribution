import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {trans} from '#/main/core/translation'
import {localeDate} from '#/main/core/scaffolding/date'
import {constants} from '#/main/core/user/tracking/constants'

import {ScoreGauge} from '#/main/core/layout/progression/components/score-gauge.jsx'

const EventWrapper = props =>
  <li className={classes('timeline-event-container', {
    'timeline-event-success': constants.STATUS_PASSED === props.status,
    'timeline-event-partial': [constants.STATUS_PASSED, constants.STATUS_FAILED].indexOf(props.status) === -1,
    'timeline-event-failure': constants.STATUS_FAILED === props.status
  })}>
    <span className={classes('timeline-event-icon', constants.TRACKING_EVENTS[props.type].icon)} />

    <div className="timeline-event">
      <span className="timeline-event-date">
        {localeDate(props.date, true)}
      </span>

      {props.status && <span className={classes('timeline-event-status', {
        'fa fa-fw fa-check': constants.STATUS_PASSED === props.status,
        'fa fa-fw fa-minus': [constants.STATUS_PASSED, constants.STATUS_FAILED].indexOf(props.status) === -1,
        'fa fa-fw fa-times': constants.STATUS_FAILED === props.status
      })} />}

      <div className="timeline-event-block">
        <div className="timeline-event-header">

        </div>

        <div className="timeline-event-content">
          {React.createElement('h'+props.level, {
            className: 'timeline-event-title'
          }, [
            props.title,
            props.subtitle && <small key="event-subtitle">{props.subtitle}</small>
          ])}

          {props.children}
        </div>

        {props.progression &&
          <div className="timeline-event-progression">
            <ScoreGauge
              userScore={Math.round(props.progression[0])}
              maxScore={props.progression[1]}
            />
          </div>
        }
      </div>
    </div>
  </li>

EventWrapper.propTypes = {
  level: T.number.isRequired,
  date: T.string.isRequired,
  title: T.string.isRequired,
  subtitle: T.string,
  status: T.oneOf(constants.TRACKING_STATUS),
  progression: T.array,
  type: T.oneOf(
    Object.keys(constants.TRACKING_EVENTS)
  ).isRequired,
  children: T.node.isRequired
}

const EvaluationEvent = props =>
  <EventWrapper
    title={props.data.resourceNode.name}
    subtitle={trans(props.data.resourceNode.meta.type, {}, 'resource')}
    level={props.level}
    date={props.date}
    status={props.status}
    type={props.type}
    progression={props.progression}
  >
    EVENT CONTENT
  </EventWrapper>

EvaluationEvent.propTypes = {
  level: T.number.isRequired,
  date: T.string.isRequired,
  status: T.oneOf(constants.TRACKING_STATUS),
  type: T.oneOf(
    Object.keys(constants.TRACKING_EVENTS)
  ).isRequired,
  progression: T.array,
  data: T.shape({
    resourceNode: T.shape({
      name: T.string.isRequired,
      meta: T.shape({
        type: T.string.isRequired
      }).isRequired
    })
  })
}

const Timeline = props =>
  <ul className="user-timeline">
    <li className="timeline-endpoint timeline-event-date">
      {trans('today', {}, 'platform')}
    </li>
    {props.events.map((event, eventIndex) =>
      <EvaluationEvent
        key={eventIndex}
        level={props.level}
        {...event}
      />
    )}
    {props.events.length > 0 &&
      <li className="timeline-endpoint timeline-event-date">
        {localeDate(props.events[props.events.length - 1].date, false)}
      </li>
    }
  </ul>

Timeline.propTypes = {
  level: T.number,
  events: T.arrayOf(T.shape({
    date: T.string.isRequired,
    type: T.string.isRequired,
    status: T.string.isRequired,
    progression: T.array,
    data: T.object
  })).isRequired
}

Timeline.defaultProps = {
  level: 3
}

export {
  Timeline
}
