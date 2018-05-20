import React from 'react'
import {PropTypes as T} from 'prop-types'
import Dropdown from 'react-bootstrap/lib/Dropdown'

const MenuOverlay = props =>
  <Dropdown
    id={props.id}
    pullRight={'right' === props.align}
    dropup={'top' === props.position}
  >
    {props.children}
  </Dropdown>

MenuOverlay.propTypes = {
  position: T.oneOf(['top', 'bottom']),
  align: T.oneOf(['left', 'right'])
}

MenuOverlay.defaultProps = {
  position: 'bottom',
  align: 'left'
}

export {
  MenuOverlay
}
