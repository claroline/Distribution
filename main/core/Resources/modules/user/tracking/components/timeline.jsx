import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {constants} from '#/main/core/user/tracking/constants'

const EventWrapper = props =>
  <li className={classes('timeline-event', {
    'timeline-event-success': 'success' === props.status,
    'timeline-event-partial': 'partial' === props.status,
    'timeline-event-failure': 'failure' === props.status
  })}>
    <span className={classes('timeline-event-icon', constants.TRACKING_EVENTS[props.type].icon)} />
    <div className="timeline-event-content">
      {props.children}
    </div>
  </li>

EventWrapper.propTypes = {
  status: T.oneOf(['success', 'partial', 'failure']),
  type: T.oneOf(
    Object.keys(constants.TRACKING_EVENTS)
  ).isRequired
}

const EvaluationEvent = props =>
  <EventWrapper
    status={props.status}
    type={props.type}
  >
    EVENT CONTENT
  </EventWrapper>

const Timeline = props =>
  <ul className="user-timeline">
    {props.events.map((event, eventIndex) =>
      <EvaluationEvent
        key={eventIndex}
        {...event}
      />
    )}
  </ul>

Timeline.propTypes = {
  events: T.arrayOf(T.shape({

  })).isRequired
}

export {
  Timeline
}
