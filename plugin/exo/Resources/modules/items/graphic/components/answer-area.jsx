import React, {PropTypes as T} from 'react'
import classes from 'classnames'
import {SHAPE_RECT, SHAPE_CIRCLE} from './../enums'

export const AnswerArea = ({color, shape, coords, radius}) =>
  <span
    className={classes('pointer', {
      'rect': shape === SHAPE_RECT,
      'circle': shape === SHAPE_CIRCLE
    })}
    style={areaStyle(color, shape, coords, radius)}
  />

AnswerArea.propTypes = {
  shape: T.oneOf([SHAPE_RECT, SHAPE_CIRCLE]).isRequired,
  coords: T.arrayOf(T.shape({
    x: T.number.isRequired,
    y: T.number.isRequired
  })).isRequired,
  color: T.string.isRequired,
  radius: T.number
}

function areaStyle(color, shape, coords, radius) {
  const isRect = shape === SHAPE_RECT

  return {
    left: isRect ? coords[0].x : (coords[0].x - radius),
    top: isRect ? coords[0].y : (coords[0].y - radius),
    width: isRect ? (coords[1].x - coords[0].x) : (radius * 2),
    height: isRect ? (coords[1].y - coords[0].y) : (radius * 2),
    backgroundColor: color,
    borderRadius: isRect ?  0 : `${radius}px`
  }
}
