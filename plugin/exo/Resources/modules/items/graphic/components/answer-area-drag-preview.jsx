import React, {Component, PropTypes as T} from 'react'
import {
  BORDER_WIDTH,
  AREA_GUTTER
} from './answer-area.jsx'

import {
  SHAPE_RECT
} from './../enums'


export const AnswerAreaDragPreview = props => {
  const isRect = props.shape === SHAPE_RECT
  const def = props.geometry
  const width = isRect ? def.coords[1].x - def.coords[0].x : def.radius * 2
  const height = isRect ? def.coords[1].y - def.coords[0].y : def.radius * 2
  const frameWidth = width + (AREA_GUTTER * 2)
  const frameHeight = height + (AREA_GUTTER * 2)
  const innerFrameWidth = frameWidth - BORDER_WIDTH * 2
  const innerFrameHeight = frameHeight - BORDER_WIDTH * 2
  const borderRadius = isRect ? 0 : def.radius
  return (
    <div style={{
      borderRadius: borderRadius,
      opacity: 0.5,
      width: innerFrameWidth + 'px',
      height: innerFrameHeight + 'px',
      backgroundColor: def.color
    }}/>
  )
}
