import React, {PropTypes as T} from 'react'

export const GridFeedback = () =>
  (
    <span>GRID FEEDBACK</span>
  )

GridFeedback.propTypes = {
  item: T.object.isRequired,
  answer: T.object.isRequired
}
