import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

class Ip extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="ip-control">
        <input type="number" min={0} max={255} placeholder={127} className={classes('form-control', this.props.size ? `input-${this.props.size}` : null)} value="" />

        <span className="dot">.</span>

        <input type="number" min={0} max={255} placeholder={0} className={classes('form-control', this.props.size ? `input-${this.props.size}` : null)} value="" />

        <span className="dot">.</span>

        <input type="number" min={0} max={255} placeholder={0} className={classes('form-control', this.props.size ? `input-${this.props.size}` : null)} value="" />

        <span className="dot">.</span>

        <input type="number" min={0} max={255} placeholder={1} className={classes('form-control', this.props.size ? `input-${this.props.size}` : null)} value="" />
      </div>
    )
  }
}

Ip.propTypes = {
  value: T.string.isRequired,
  onChange: T.func.isRequired,
  size: T.oneOf(['sm', 'lg'])
}

export {
  Ip
}
