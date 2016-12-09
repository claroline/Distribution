import React, {PropTypes as T} from 'react'
import classes from 'classnames'

export const FormGroup = ({controlId, label, help, error, children}) =>
  <div className={classes('form-group', {'has-error': error})}>
    <label className="control-label" htmlFor={controlId}>{label}</label>
    {children}
    {error &&
      <span id={`help-${controlId}`} className="help-block">
        <span className="fa fa-warning"></span>
        {error}
      </span>
    }
    {help &&
      <span id={`help-${controlId}`} className="help-block">
        <span className="fa fa-info-circle"></span>
        {help}
      </span>
    }
  </div>

FormGroup.propTypes = {
  controlId: T.string.isRequired,
  label: T.string.isRequired,
  children: T.object.isRequired,
  help: T.string,
  error: T.string
}
