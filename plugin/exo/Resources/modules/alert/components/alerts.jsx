import React, {PropTypes as T} from 'react'
import Alert from 'react-bootstrap/lib/Alert'

const AlertInfo = props =>
  <Alert bsStyle="info">
    <span className="fa fa-fw fa-info-circle"></span>
    {props.text}
  </Alert>

const AlertSuccess = props =>
  <Alert bsStyle="success">
    <span className="fa fa-fw fa-check"></span>
    {props.text}
  </Alert>

const AlertWarning = props =>
  <Alert bsStyle="warning">
    <span className="fa fa-fw fa-warning"></span>
    {props.text}
  </Alert>

const AlertError = props =>
  <Alert bsStyle="danger">
    <span className="fa fa-fw fa-times"></span>
    {props.text}
  </Alert>

AlertInfo.propTypes = AlertSuccess.propTypes = AlertError.propTypes = AlertWarning.propTypes = {
  text: T.string.isRequired
}

const Alerts = props => {
  const alerts = props.alerts.map(alert => {
    switch (alert.type) {
      case 'info':
        return <AlertInfo key={alert.id} text={alert.text} />
      case 'success':
        return <AlertSuccess key={alert.id} text={alert.text} />
      case 'warning':
        return <AlertWarning key={alert.id} text={alert.text} />
      case 'error':
        return <AlertError key={alert.id} text={alert.text} />
    }
  })

  return (
    <ul className="alerts">
      {alerts}
    </ul>
  )
}

Alerts.propTypes = {
  alerts: T.arrayOf(T.shape({
    id: T.string.isRequired,
    type: T.oneOf(['success', 'warning', 'error', 'info']).isRequired,
    text: T.string.isRequired,
    dismissible: T.bool
  })).isRequired
}

export {Alerts}
