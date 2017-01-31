import React, {PropTypes as T} from 'react'
import {asset} from '#/main/core/asset'
import {POINTER_CORRECT, POINTER_WRONG} from './enums'
import {PointableImage} from './components/pointable-image.jsx'
import {isCorrect} from './player'

export const GraphicFeedback = props =>
  <PointableImage
    src={props.item.image.data || asset(props.item.image.url)}
    absWidth={props.item.image.width}
    pointers={props.answer.map(coords => ({
      absX: coords.x,
      absY: coords.y,
      type: isCorrect(coords, props.item.solutions) ?
        POINTER_CORRECT :
        POINTER_WRONG
    }))}
  />

GraphicFeedback.propTypes = {
  item: T.shape({
    image: T.oneOfType([
      T.shape({
        data: T.string.isRequired,
        width: T.number.isRequired
      }),
      T.shape({
        url: T.string.isRequired,
        width: T.number.isRequired
      })
    ]).isRequired,
    solutions: T.arrayOf(T.shape({
      area: T.shape({
        id: T.string.isRequired,
        shape: T.string.isRequired,
        color: T.string.isRequired
      }).isRequired
    })).isRequired
  }).isRequired,
  answer: T.arrayOf(T.shape({
    x: T.number.isRequired,
    y: T.number.isRequired
  })).isRequired
}
