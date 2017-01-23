import React, {PropTypes as T} from 'react'

export const CircleArea = ({center, radius, color}) =>
  <span
    className="area circle"
    style={{
      left: center.x - radius,
      top: center.y - radius,
      width: radius * 2,
      height: radius * 2,
      backgroundColor: color,
      borderRadius: `${radius}px`
    }}
  />

CircleArea.propTypes = {
  center: T.shape({
    x: T.number.isRequired,
    y: T.number.isRequired
  }).isRequired,
  radius: T.number.isRequired,
  color: T.string.isRequired
}

export const RectArea = ({coords, color}) =>
  <span
    className="area rect"
    style={{
      left: coords[0].x,
      top: coords[0].y,
      width: coords[1].x - coords[0].x,
      height: coords[1].y - coords[0].y,
      backgroundColor: color
    }}
  />

RectArea.propTypes = {
  coords: T.arrayOf(T.shape({
    x: T.number.isRequired,
    y: T.number.isRequired
  })).isRequired,
  color: T.string.isRequired
}
