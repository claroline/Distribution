import React, {PropTypes as T} from 'react'
import ReactDOM from 'react-dom'
import classes from 'classnames'
import tinycolor from 'tinycolor2'
import Popover from 'react-bootstrap/lib/Popover'
import {makeDraggable} from './../../../utils/dragAndDrop'
import {SHAPE_RECT, SHAPE_CIRCLE, TYPE_ANSWER_AREA} from './../enums'
import {AreaResizer, AreaResizerDraggable} from './area-resizer.jsx'

const FRAME_GUTTER = 2
const AREA_GUTTER = 8
const BORDER_WIDTH = 2
const RESIZER_SIZE = 6

export const AnswerArea = props => {
  if (props.isDragging) {
    return null
  }

  const isRect = props.shape === SHAPE_RECT
  const def = props.geometry
  const left = isRect ? def.coords[0].x : def.center.x - def.radius
  const top = isRect ? def.coords[0].y : def.center.y - def.radius
  const width = isRect ? def.coords[1].x - def.coords[0].x : def.radius * 2
  const height = isRect ? def.coords[1].y - def.coords[0].y : def.radius * 2
  const frameWidth = width + (AREA_GUTTER * 2)
  const frameHeight = height + (AREA_GUTTER * 2)
  const innerFrameWidth = frameWidth - BORDER_WIDTH * 2
  const innerFrameHeight = frameHeight - BORDER_WIDTH * 2
  const handleWidth = width + (FRAME_GUTTER + AREA_GUTTER) * 2
  const handleHeight = height + (FRAME_GUTTER + AREA_GUTTER) * 2
  const borderRadius = isRect ? 0 : def.radius
  const halfSizer = RESIZER_SIZE / 2
  const border = BORDER_WIDTH

  const makeResizer = makeResizerFactory(props.resizable, props.id, RESIZER_SIZE)
  const resizers = [
    [-halfSizer - border, -halfSizer - border, 'nw'],
    [-halfSizer - border, innerFrameWidth / 2 - halfSizer, 'n'],
    [-halfSizer - border, innerFrameWidth + border - halfSizer, 'ne'],
    [innerFrameHeight / 2 - halfSizer, innerFrameWidth + border - halfSizer, 'e'],
    [innerFrameHeight + border - halfSizer, innerFrameWidth + border - halfSizer, 'se'],
    [innerFrameHeight + border - halfSizer, innerFrameWidth / 2 - halfSizer, 's'],
    [innerFrameHeight + border - halfSizer, - halfSizer - border, 'sw'],
    [innerFrameHeight / 2 - halfSizer, - halfSizer - border, 'w']
  ]

  return props.connectDragSource(
    <span
      className={classes('area-handle', {
        selected: props.selected,
        undraggable: !props.canDrag
      })}
      onMouseDown={() => props.onSelect(props.id)}
      style={common({
        left: left - FRAME_GUTTER - AREA_GUTTER,
        top: top - FRAME_GUTTER - AREA_GUTTER,
        width: handleWidth,
        height: handleHeight
      })}
    >
      <span
        className="area-frame"
        style={common({
          left: FRAME_GUTTER,
          top: FRAME_GUTTER,
          width: frameWidth,
          height: frameHeight,
          borderWidth: BORDER_WIDTH
        })}
      >
        <span className="area"
          style={common({
            left: AREA_GUTTER - BORDER_WIDTH,
            top: AREA_GUTTER - BORDER_WIDTH,
            width: width,
            height: height,
            backgroundColor: tinycolor(props.color).setAlpha(0.5).toRgbString(),
            borderRadius: `${borderRadius}px`,
            border: `solid 2px ${props.color}`
          })}
        />

        {resizers.map(makeResizer)}

        <span
          className="fa fa-pencil"
          role="button"
          style={common({right: -22})}
          onClick={e => {
            const rect = e.target.getBoundingClientRect()
            props.togglePopover(
              props.id,
              rect.left + window.pageXOffset - 189, // works with fixed size popover
              rect.top + window.pageYOffset - 179
            )
          }}
        />
        <span
          className="fa fa-trash-o"
          role="button"
          style={common({right: -22, top: 20})}
          onClick={() => props.onDelete(props.id)}
        />
      </span>
    </span>
  )
}

AnswerArea.propTypes = {
  id: T.string.isRequired,
  shape: T.oneOf([SHAPE_RECT, SHAPE_CIRCLE]),
  color: T.string.isRequired,
  selected: T.bool.isRequired,
  onSelect: T.func.isRequired,
  canDrag: T.bool.isRequired,
  isDragging: T.bool.isRequired,
  connectDragSource: T.func.isRequired,
  togglePopover: T.func.isRequired,
  onDelete: T.func.isRequired,
  resizable: T.bool.isRequired,
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

AnswerArea.defaultProps = {
  resizable: true
}

export const AnswerAreaDraggable = makeDraggable(
  AnswerArea,
  TYPE_ANSWER_AREA,
  props => ({
    type: TYPE_ANSWER_AREA,
    id: props.id
  })
)

function common(rules) {
  return Object.assign(rules, {
    display: 'inline-block',
    position: 'absolute'
  })
}

function makeResizerFactory(resizable, areaId, size) {
  return (geometry, index) =>
    React.createElement(
      resizable ? AreaResizerDraggable : AreaResizer,
      Object.assign(geometry, {
        areaId,
        size,
        connectDragSource: el => el,
        key: `${areaId}-${index}`,
        top: geometry[0],
        left: geometry[1],
        position: geometry[2]
      })
    )
}
