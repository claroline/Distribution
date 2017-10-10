import React from 'react'
import {PropTypes as T} from 'prop-types'

import {asset} from '#/main/core/asset'
import {t} from '#/main/core/translation'

/**
 * Avatar of a User.
 *
 * @param props
 * @constructor
 */
const Avatar = props =>
  props.picture ?
    <img className="user-avatar" src={asset('uploads/pictures/'+props.picture)} /> :
    <span className="user-avatar fa fa-user-circle-o" />

Avatar.propTypes = {
  picture: T.string
}

export {
  Avatar
}
