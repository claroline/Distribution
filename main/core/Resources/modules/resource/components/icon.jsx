import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {getIcon} from '#/main/core/resource/utils'

const ResourceIcon = props =>
  <img className={classes('resource-icon', props.className)} src={getIcon(props.mimeType)} />

ResourceIcon.propTypes = {
  mimeType: T.string.isRequired
}

export {
  ResourceIcon
}
