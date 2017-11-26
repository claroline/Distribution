import React from 'react'
import classes from 'classnames'

import {PropTypes as T, implementPropTypes} from '#/main/core/prop-types'
import {FlyingAlert as FlyingAlertTypes} from '#/main/core/layout/alert/prop-types'
import {constants} from '#/main/core/layout/alert/constants'

const FlyingAlert = props =>
  <li className={`flying-alert flying-alert-${props.type}`}>
    <span className={classes('flying-alert-icon fa fa-fw', {
      'fa-check': 'success' === props.type,
      'fa-exclamation': 'warning' === props.type,
      'fa-times': 'error' === props.type,
      'fa-info': 'info' === props.type,
      'fa-spinner fa-pulse': 'loading' === props.type
    })} />

    <span className="flying-alert-message">
      {props.message}

      {props.details &&
        <button type="button">
          show details
        </button>
      }
    </span>
  </li>

implementPropTypes(FlyingAlert, FlyingAlertTypes)

const FlyingAlerts = props =>
  <ul className="flying-alerts">
    {props.alerts.slice(0, constants.FLYING_ALERTS_MAX).map((alert, alertIndex) =>
      <FlyingAlert key={alertIndex} {...alert} />
    )}
  </ul>

FlyingAlerts.propTypes = {
  alerts: T.arrayOf(T.shape(
    FlyingAlertTypes.propTypes
  )).isRequired,
  removeAlert: T.func.isRequired
}

export {
  FlyingAlerts
}
