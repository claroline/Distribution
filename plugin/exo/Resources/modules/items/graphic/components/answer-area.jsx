import React, {PropTypes as T} from 'react'
import classes from 'classnames'
import {makeDraggable} from './../../../utils/dragAndDrop'
import {SHAPE_RECT, SHAPE_CIRCLE} from './../enums'

let AnswerArea = props => {
  if (props.isDragging) {
    return null
  }

  const isRect = props.shape === SHAPE_RECT
  const def = props.geometry
  const left = isRect ? def.coords[0].x : def.center.x - def.radius
  const top = isRect ? def.coords[0].y : def.center.y - def.radius
  const width = isRect ? def.coords[1].x - def.coords[0].x : def.radius * 2
  const height = isRect ? def.coords[1].y - def.coords[0].y : def.radius * 2
  const borderRadius = isRect ? 0 : def.radius

  return props.connectDragSource(
    <span
      className={classes('area-handle', {selected: props.selected})}
      onMouseDown={() => props.onSelect(props.id)}
      style={{
        left: left - 6,
        top: top - 6,
        width: width + 12,
        height: height + 12,
        backgroundColor: props.selected ?
          'rgba(0, 0, 255, 0.2)' :
          'transparent'
      }}
    >
      <span className="area"
        style={{
          left: 4,
          top: 4,
          width: width,
          height: height,
          backgroundColor: 'rgba(0, 0, 255, 0.5)',
          borderRadius: `${borderRadius}px`
        }}
      />
    </span>
  )
}

AnswerArea.propTypes = {
  id: T.string.isRequired,
  shape: T.oneOf([SHAPE_RECT, SHAPE_CIRCLE]),
  color: T.string.isRequired,
  selected: T.bool.isRequired,
  onSelect: T.func.isRequired,
  isDragging: T.bool.isRequired,
  connectDragSource: T.func.isRequired,
  geometry: T.oneOfType([
    T.shape({
      coords: T.arrayOf(T.shape({
        x: T.number.isRequired,
        y: T.number.isRequired
      })).isRequired
    }),
    T.shape({
      center: T.shape({
        x: T.number.isRequired,
        y: T.number.isRequired
      }).isRequired,
      radius: T.number.isRequired
    })
  ]).isRequired
}

AnswerArea = makeDraggable(AnswerArea, 'AnswerArea', props => ({id: props.id}))

export {AnswerArea}
