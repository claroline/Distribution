import React, {PropTypes as T} from 'react'
import classes from 'classnames'
import {makeDraggable} from './../../../utils/dragAndDrop'
import {TYPE_AREA_RESIZER} from './../enums'

export const AreaResizer = props => {
  return props.connectDragSource(
    <span
      className={classes('resizer', props.position)}
      style={{
        display: 'inline-block',
        position: 'absolute',
        top: props.top,
        left: props.left,
        width: props.size,
        height: props.size,
      }}
    />
  )
}

AreaResizer.propTypes = {
  areaId: T.string.isRequired,
  top: T.number.isRequired,
  left: T.number.isRequired,
  size: T.number.isRequired,
  position: T.oneOf([
    'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'
  ]).isRequired,
  connectDragSource: T.func.isRequired
}

export const AreaResizerDraggable = makeDraggable(
  AreaResizer,
  TYPE_AREA_RESIZER,
  props => ({
    type: TYPE_AREA_RESIZER,
    areaId: props.areaId,
    position: props.position
  })
)
