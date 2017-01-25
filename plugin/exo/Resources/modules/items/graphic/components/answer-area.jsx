import React, {PropTypes as T} from 'react'
import ReactDOM from 'react-dom'
import classes from 'classnames'
import Popover from 'react-bootstrap/lib/Popover'
import Overlay from 'react-bootstrap/lib/Overlay'
import {makeDraggable} from './../../../utils/dragAndDrop'
import {SHAPE_RECT, SHAPE_CIRCLE} from './../enums'

const HANDLE_GUTTER = 6
const BORDER_WIDTH = 2
const SIZER_WIDTH = 6

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
  const sizerOffset = (SIZER_WIDTH - BORDER_WIDTH) / 2

  return props.connectDragSource(
    <span
      className={classes('area-handle', {
        selected: props.selected,
        undraggable: !props.canDrag
      })}
      onMouseDown={() => props.onSelect(props.id)}
      style={{
        left: left - HANDLE_GUTTER,
        top: top - HANDLE_GUTTER,
        width: width + HANDLE_GUTTER * 2,
        height: height + HANDLE_GUTTER * 2,
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

      <span className="sizer nw" style={{top: -4, left: -4}}/>
      <span className="sizer n" style={{top: -4, left: width / 2}}/>
      <span className="sizer ne" style={{top: -4, right: -4}}/>
      <span className="sizer e" style={{top: height / 2, right: -4}}/>
      <span className="sizer se" style={{bottom: -4, right: - 4}}/>
      <span className="sizer s" style={{bottom: -4, right: width / 2}}/>
      <span className="sizer sw" style={{bottom: -4, left: -4}}/>
      <span className="sizer w" style={{top: height / 2, left: -4}}/>

      <span
        className="fa fa-pencil"
        role="button"
        style={{right: -20}}
        onClick={e => {
          const rect = e.target.getBoundingClientRect()
          props.togglePopover(
            props.id,
            rect.left + window.pageXOffset - 187, // rough estimate of offset
            rect.top + window.pageYOffset - 170
          )
        }}
      />
      <span
        className="fa fa-trash-o"
        role="button"
        style={{right: -20, top: 18}}
        onClick={() => props.onDelete(props.id)}
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
