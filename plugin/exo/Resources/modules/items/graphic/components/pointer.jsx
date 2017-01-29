import React, {PropTypes as T} from 'react'
import {POINTER_PLACED, POINTER_CORRECT, POINTER_WRONG} from './../enums'

const POINTER_WIDTH = 32
const SEGMENT_WIDTH = 6

export const Pointer = props => {
  if (props.x < 0 || props.y < 0) {
    return null
  }

  const segmentOffset = POINTER_WIDTH / 2 - SEGMENT_WIDTH / 2
  const segments = [
    [segmentOffset, 0, SEGMENT_WIDTH, segmentOffset, 'n'],
    [segmentOffset + SEGMENT_WIDTH, segmentOffset, segmentOffset, SEGMENT_WIDTH, 'e'],
    [segmentOffset, segmentOffset + SEGMENT_WIDTH, SEGMENT_WIDTH, segmentOffset, 's'],
    [0, segmentOffset, segmentOffset, SEGMENT_WIDTH, 'w']
  ]

  return (
    <div
      className={`pointer ${props.type}`}
      style={{
        position: 'absolute',
        width: POINTER_WIDTH + 'px',
        height: POINTER_WIDTH + 'px',
        top: props.y - POINTER_WIDTH / 2,
        left: props.x - POINTER_WIDTH / 2,
        cursor: 'inherit'
      }}
    >
      {segments.map(s =>
        <span
          key={`${s[0]}${s[1]}${s[2]}${s[3]}`}
          className={`segment ${s[4]}`}
          style={{
            position: 'absolute',
            left: s[0],
            top: s[1],
            width: s[2],
            height: s[3]
          }}
        />
      )}
    </div>
  )
}

Pointer.propTypes = {
  x: T.number.isRequired,
  y: T.number.isRequired,
  type: T.oneOf([POINTER_PLACED, POINTER_CORRECT, POINTER_WRONG])
}
