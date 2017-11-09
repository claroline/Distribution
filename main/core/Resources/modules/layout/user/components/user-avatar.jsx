import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {asset} from '#/main/core/asset'

/**
 * Avatar of a User.
 *
 * @param props
 * @constructor
 */
const UserAvatar = props =>
  props.picture ?
    <img className="user-avatar" alt="avatar" src={asset('uploads/pictures/'+props.picture)} /> :
    <span className={classes('user-avatar fa', {
      'fa-user-circle-o': !props.alt,
      'fa-user': props.alt
    })} />

UserAvatar.propTypes = {
  picture: T.string,
  alt: T.bool
}

UserAvatar.defaultProps = {
  alt: true
}

export {
  UserAvatar
}
