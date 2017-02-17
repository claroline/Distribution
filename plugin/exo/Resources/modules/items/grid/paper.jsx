import React, {PropTypes as T} from 'react'

export const GridPaper = () =>
  (
    <span>GRID PAPER</span>
  )

GridPaper.propTypes = {
  item: T.object.isRequired,
  answer: T.array.isRequired
}
