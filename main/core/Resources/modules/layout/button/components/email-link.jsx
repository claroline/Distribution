import React from 'react'
import {PropTypes as T} from 'prop-types'

const EmailLink = props =>
  <a href={`mailto:${props.value}`}>
    {props.value}
  </a>

EmailLink.propTypes = {
  value: T.string.isRequired
}

export {
  EmailLink
}
