import React, {PropTypes as T} from 'react'
import ReactDOM from 'react-dom'
import classes from 'classnames'
import tinycolor from 'tinycolor2'
import Popover from 'react-bootstrap/lib/Popover'
import Overlay from 'react-bootstrap/lib/Overlay'
import {makeDraggable} from './../../../utils/dragAndDrop'
import {SHAPE_RECT, SHAPE_CIRCLE} from './../enums'

const FRAME_GUTTER = 2
const AREA_GUTTER = 8
const BORDER_WIDTH = 2
const SIZER_SIZE = 6

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
  const frameWidth = width + (AREA_GUTTER * 2)
  const frameHeight = height + (AREA_GUTTER * 2)
  const handleWidth = width + (FRAME_GUTTER + AREA_GUTTER) * 2
  const handleHeight = height + (FRAME_GUTTER + AREA_GUTTER) * 2
  const borderRadius = isRect ? 0 : def.radius
  const halfSizer = SIZER_SIZE / 2

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

        <span
          className="sizer nw"
          style={sizer({top: -halfSizer, left: -halfSizer})}
        />
        <span
          className="sizer n"
          style={sizer({top: -halfSizer, left: frameWidth / 2 - halfSizer})}
        />
        <span
          className="sizer ne"
          style={sizer({top: -halfSizer, right: -halfSizer})}
        />
        <span
          className="sizer e"
          style={sizer({top: frameHeight / 2 - halfSizer, right: -halfSizer})}
        />
        <span
          className="sizer se"
          style={sizer({bottom: -halfSizer, right: -halfSizer})}
        />
        <span
          className="sizer s"
          style={sizer({bottom: -halfSizer, left: frameWidth / 2 - halfSizer})}
        />
        <span
          className="sizer sw"
          style={sizer({bottom: -halfSizer, left: -halfSizer})}
        />
        <span
          className="sizer w"
          style={sizer({top: frameHeight / 2 - halfSizer, left: -halfSizer})}
        />

        <span
          className="fa fa-pencil"
          role="button"
          style={common({right: -22})}
          onClick={e => {
            const rect = e.target.getBoundingClientRect()
            props.togglePopover(
              props.id,
              rect.left + window.pageXOffset - 189, // rough estimate of offset
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
  isDragging: T.bool.isRequired,
  connectDragSource: T.func.isRequired,
  togglePopover: T.func.isRequired,
  onDelete: T.func.isRequired,
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

AnswerArea = makeDraggable(
  AnswerArea,
  'AnswerArea',
  props => ({id: props.id})
)

export {AnswerArea}

function common(rules) {
  return Object.assign(rules, {
    display: 'inline-block',
    position: 'absolute'
  })
}

function sizer(rules) {
  return Object.assign(common(rules), {
    width: SIZER_SIZE,
    height: SIZER_SIZE
  })
}
