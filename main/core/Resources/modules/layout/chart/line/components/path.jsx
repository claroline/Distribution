import React from 'react'
import {PropTypes as T} from 'prop-types'

const Path = (props) =>
  <path
    stroke={props.strokeColor}
    strokeWidth={props.strokeWidth}
    strokeDasharray={props.strokeDasharray.join(', ')}
    fill={props.fillColor}
    d={props.d}
  />

Path.propTypes = {
  strokeColor: T.string.isRequired,
  d: T.string.isRequired,
  fillColor: T.string,
  strokeWidth: T.number,
  strokeDasharray: T.array
}

Path.defaultProps = {
  fillColor: 'none',
  strokeWidth: 2,
  strokeDasharray: ['none']
}

export {
  Path
}