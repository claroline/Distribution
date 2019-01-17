import React from 'react'
import {PropTypes as T} from 'prop-types'
import {Portal} from 'react-overlays'
import classes from 'classnames'

const OverlayStack = props =>
  <Portal container={() => document.querySelector('.app-overlays-container')}>
    {props.overlays}

    <div className={classes('app-overlays', props.show && 'overlay-open')} style={!props.show ? {display: 'none'} : undefined}>
      {props.blockingOverlays}
    </div>
  </Portal>

OverlayStack.propTypes = {
  show: T.bool,
  overlays: T.oneOfType([T.node, T.arrayOf(T.node)]),
  blockingOverlays: T.oneOfType([T.node, T.arrayOf(T.node)])
}

OverlayStack.defaultProps = {
  show: false
}

export {
  OverlayStack
}
