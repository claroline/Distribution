import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {asset} from '#/main/core/scaffolding/asset'

/**
 * Avatar of a User.
 *
 * @param props
 * @constructor
 */
const Thumbnail = props =>
  props.thumbnail ?
    <img className={classes('workspace-thumbnail', props.className)} alt="thumbnail" src={asset(props.thumbnail.url)} /> :
    <span className={classes('workspace-thumbnail fa', props.className, {'fa-book': true})} />

Thumbnail.propTypes = {
  className: T.string,
  thumbnail: T.shape({
    url: T.string.isRequired
  }),
  alt: T.bool
}

Thumbnail.defaultProps = {
  alt: true
}

export {
  Thumbnail
}
