import React from 'react'
import {PropTypes as T} from 'prop-types'
import merge from 'lodash/merge'

import {Action as ActionTypes} from '#/main/app/action/prop-types'
import {Button} from '#/main/app/action/components/button'

const MenuItem = props =>
  <li role="presentation">
    <Button
      {...props}
      tabIndex={-1}
      onClick={props.onSelect ? (e) => props.onSelect(props.eventKey, e) : undefined}
    />
  </li>

MenuItem.propTypes = merge({}, ActionTypes.propTypes, {
  // from standard dropdown MenuItem
  eventKey: T.string,
  onSelect: T.func
})
MenuItem.defaultProps = merge({}, ActionTypes.defaultProps)

export {
  MenuItem
}
