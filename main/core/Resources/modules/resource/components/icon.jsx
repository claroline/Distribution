import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {getIcon} from '#/main/core/resource/utils'
import {ResourceNode as ResourceNodeTypes} from '#/main/core/resource/prop-types'

const ResourceIcon = props =>
  <img className={classes('resource-icon', props.className)} src={getIcon(props.resourceNode)} />

ResourceIcon.propTypes = {
  resourceNode: T.shape(
    ResourceNodeTypes.propTypes
  ).isRequired
}

export {
  ResourceIcon
}
