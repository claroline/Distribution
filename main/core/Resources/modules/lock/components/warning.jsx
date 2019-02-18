import React from 'react'
import {PropTypes as T} from 'prop-types'
import {User as UserType} from '#/main/core/user/prop-types'

const Warning = props =>
  <div>
    {props.lock.user.username}
    {props.lock.value ? 'true': 'false'}
    {props.lock.updated}
  </div>

Warning.propTypes = {
  lock: T.shape(
    {
      updated: T.string,
      value: T.boolean,
      user: T.shape(
        UserType.propTypes
      ).isRequired
    }
  )
}

export {
  Warning
}
