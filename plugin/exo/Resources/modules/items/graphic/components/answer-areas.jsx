import React, {PropTypes as T} from 'react'
import classes from 'classnames'

const AreaHandle = ({parentWidth, parentHeight, color}) =>
  <span
    className="area-handle"
    style={{
      top: - 6,
      left: - 6,
      width: parentWidth + 12,
      height: parentHeight + 12,
      backgroundColor: color,
    }}
  />

AreaHandle.propTypes = {
  parentWidth: T.number.isRequired,
  parentHeight: T.number.isRequired,
  color: T.string.isRequired
}

export const CircleArea = props =>
  <span
    className={classes('area', 'circle', {selected: props.selected})}
    onMouseDown={() => props.onSelect(id)}
    draggable={true}
    onDragStart={props.onDragStart}
    onDragEnd={props.onDragEnd}
    style={{
      left: props.center.x - props.radius,
      top: props.center.y - props.radius,
      width: props.radius * 2,
      height: props.radius * 2,
      backgroundColor: 'rgba(0, 0, 255, 0.5)',
      borderRadius: `${props.radius}px`
    }}
  >
    {props.selected &&
      <AreaHandle
        parentWidth={props.radius * 2}
        parentHeight={props.radius * 2}
        color="rgba(0, 0, 255, 0.2)"
      />
    }
  </span>

CircleArea.propTypes = {
  id: T.string.isRequired,
  center: T.shape({
    x: T.number.isRequired,
    y: T.number.isRequired
  }).isRequired,
  radius: T.number.isRequired,
  color: T.string.isRequired,
  selected: T.bool.isRequired,
  onSelect: T.func.isRequired,
  onDragStart: T.func.isRequired,
  onDragEnd: T.func.isRequired
}

export const RectArea = props =>
  <span
    className={classes('area', 'rect', {selected: props.selected})}
    onMouseDown={() => props.onSelect(props.id)}
    draggable={true}
    onDragStart={props.onDragStart}
    onDragEnd={props.onDragEnd}
    style={{
      left: props.coords[0].x,
      top: props.coords[0].y,
      width: props.coords[1].x - props.coords[0].x,
      height: props.coords[1].y - props.coords[0].y,
      backgroundColor: 'rgba(0, 0, 255, 0.5)'
    }}
  >
    {props.selected &&
      <AreaHandle
        parentWidth={props.coords[1].x - props.coords[0].x}
        parentHeight={props.coords[1].y - props.coords[0].y}
        color="rgba(0, 0, 255, 0.2)"
      />
    }
  </span>

RectArea.propTypes = {
  id: T.string.isRequired,
  coords: T.arrayOf(T.shape({
    x: T.number.isRequired,
    y: T.number.isRequired
  })).isRequired,
  color: T.string.isRequired,
  selected: T.bool.isRequired,
  onSelect: T.func.isRequired,
  onDragStart: T.func.isRequired,
  onDragEnd: T.func.isRequired
}
